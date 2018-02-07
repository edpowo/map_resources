################################################################################
##
## <PROJ> College Advising Map
## <FILE> make_data.R
## <AUTH> Benjamin Skinner
## <INIT> September 2017
##
################################################################################

## libraries
libs <- c('tidyverse', 'geojsonio', 'sp', 'rgdal', 'stringr')
lapply(libs, require, character.only = TRUE)

## paths
ddir <- '../data'
jdir <- '../js'
rdir <- file.path(ddir, '_raw')

## crosswalk
cw <- read_csv(file.path(ddir, 'stcrosswalk.csv'))

################################################################################
## FUNCTIONS
################################################################################

## slight modification of stringr::str_to_title
str_to_title_mod <- function(x) {
    x <- str_to_title(x)
    ## Of --> of
    x <- gsub(' Of ', ' of ', x, fixed = TRUE)
    ## And --> and
    x <- gsub(' And ', ' and ', x, fixed = TRUE)
    ## The --> the
    x <- gsub(' The ', ' the ', x, fixed = TRUE)
    ## A --> a
    x <- gsub(' A ', ' a ', x, fixed = TRUE)
    return(x)
}

## write dataframe to JS array with no unnecessary whitespace
writeJSArray <- function(df, array_name, vars, outfile) {

    df <- df[,names(df) %in% vars]
    ## maintain 1 index (JS is zero-index) for sanity
    lines <- paste0(array_name,'=[{}')

    for (i in 1:nrow(df)) {
        ## line <- paste0(array_name, '[', i, ']={')
        line <- paste0('{')
        for (v in 1:length(vars)) {
            if (!is.na(df[i, grep(vars[v], names(df))])) {
                if (v == 1) {
                } else {
                    line <- paste0(line,',')
                }
                if (class(df[[vars[v]]]) == 'character') {
                    line <- paste0(line, vars[v], ':"',
                                   df[i, grepl(vars[v], names(df))], '"')
                } else {
                    line <- paste0(line, vars[v], ':',
                                   df[i, grepl(vars[v], names(df))])
                }

            }
        }
        line <- paste0(line, '}')
        if (i == nrow(df)) { line <- paste0(line, '];') }
        lines <- c(lines,line)
    }
    writeLines(paste(lines, collapse = ','), outfile)
}

################################################################################
## CLEAN DATA
################################################################################

## -------------------------------------
## COLLEGE
## -------------------------------------

## read in school data
college <- read_csv(file.path(rdir, 'HD2015.zip')) %>%
    setNames(tolower(names(.))) %>%
    select(instnm, fips, sector, lon = longitud, lat = latitude) %>%
    filter(sector %in% c(1,2,4,5),
           fips %in% cw$stfips) %>%
    mutate(lon = as.numeric(lon),
           lat = as.numeric(lat),
           cat = ifelse(sector == 1, 5,
                 ifelse(sector == 2, 6,
                 ifelse(sector == 4, 7,
                 ifelse(sector == 5, 8, 0))))) %>%
    select(-sector) %>%
    filter(!is.na(lon),
           !is.na(lat))

## -------------------------------------
## HIGH SCHOOL
## -------------------------------------

## read in school data
hs <- read_csv(file.path(rdir, 'school_level_clean.csv')) %>%
    setNames(tolower(names(.))) %>%
    select(nces_id,
           nces_dist_id,
           instnm = school_name,
           fips = school_state_fips,
           lon = school_longitude,
           lat = school_latitude,
           enroltot = school_enrollment_total,
           frlpct = school_frl_pct,
           csr = school_stu_cou_ratio) %>%
    filter(fips %in% cw$stfips) %>%
    mutate(instnm = str_to_title_mod(instnm),
           lon = as.numeric(lon),
           lat = as.numeric(lat),
           fips = as.integer(fips)) %>%
    filter(!is.na(lon),
           !is.na(lat))

hs_imp <- hs %>%
    group_by(fips) %>%
    summarise(csr_mean = mean(csr, na.rm = TRUE)) %>%
    ungroup()

## advising programs at school level
advise <- read_csv(file.path(rdir, 'advising_program_school_clean.csv')) %>%
    setNames(tolower(names(.))) %>%
    unite(advise_org, c('org_1','org_2'), sep = '|') %>%
    mutate(advise_org = gsub('\\|NA$', '', advise_org))

## merge into high school data
hs <- hs %>%
    ## left_join(dist) %>%
    left_join(advise) %>%
    left_join(hs_imp) %>%
    select(-starts_with('nces_')) %>%
    mutate(csr_flag = as.integer(is.na(csr)),
           csr = ifelse(is.na(csr), csr_mean, csr),
           cat = ifelse(!is.na(advise_org) & !is.na(csr), 1,
                 ifelse(is.na(advise_org) & !is.na(csr), 2,
                 ifelse(!is.na(advise_org) & is.na(csr), 3,
                 ifelse(is.na(advise_org) & is.na(csr), 4, 0)))))

## -------------------------------------
## COMMUNITY
## -------------------------------------

## advising programs at school level
community <- read_csv(file.path(rdir, 'advising_program_community_clean.csv')) %>%
    setNames(tolower(names(.))) %>%
    unite(advise_org, c('org_1','org_2','org_3'), sep = '|') %>%
    mutate(advise_org = gsub('\\|NA$|\\|NA\\|NA$', '', advise_org),
           zip = sprintf('%05d', zip))

## get zipcode geo
zipgeo <- read_tsv(file.path(rdir, '2016_Gaz_zcta_national.zip')) %>%
    setNames(tolower(names(.))) %>%
    mutate(zip = geoid,
           lon = intptlong,
           lat = intptlat) %>%
    select(zip, lon, lat)

## merge to community
community <- community %>%
    left_join(zipgeo) %>%
    mutate(cat = 9) %>%
    ## need to fix!
    na.omit()

################################################################################
## COMBINE & WRITE
################################################################################

## bind
df <- bind_rows(college, hs, community) %>%
    mutate(z = row_number()) %>%             # redundant id #
    ## rename for very small names
    rename(a = cat,                          # a := category
           b = instnm,                       # b := name
           c = fips,                         # c := fips
           d = enroltot,                     # d := enrollment (hs)
           e = frlpct,                       # e := frpl pct (hs)
           f = csr,                          # f := stu/cou ratio (hs)
           g = advise_org,                   # g := hs advising orgs
           h = csr_flag,                     # h := missing csr
           i = zip)                          # i := zip code

## set up as SP data frame
lonlat <- df %>% select(lon, lat) %>% as.matrix()
dfsp <- SpatialPointsDataFrame(lonlat, df %>% select(z),
                               proj4string = CRS('+init=epsg:3857'))

## write as geojson
geojson_write(input = dfsp, file = file.path(ddir, 'icons.geojson'))

## write data as minified JS
writeJSArray(df, 's', letters[1:9], file.path(jdir, 'icon_array.js'))

## =============================================================================
## END FILE
################################################################################
