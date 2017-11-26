################################################################################
##
## <PROJ> College Advising Map
## <FILE> make_data.R
## <AUTH> Benjamin Skinner
## <INIT> September 2017
##
################################################################################

## libraries
libs <- c('tidyverse', 'geojsonio', 'sp', 'rgdal')
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
    lines <- paste0(array_name,'=[]')

    for (i in 1:nrow(df)) {
        line <- paste0(array_name, '[', i, ']={')
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
        lines <- c(lines,line)
    }

    writeLines(lines, outfile, sep = ';')

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
           is_col = 1) %>%
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
           !is.na(lat)) %>%
    mutate(is_col = 0)

## get district stuff to merge in
dist <- read_csv(file.path(rdir, 'district_level_clean.csv')) %>%
    setNames(tolower(names(.))) %>%
    select(nces_dist_id,
           district_name,
           district_enrollment_grade12,
           district_frl_pct,
           district_stu_cou_ratio,
           district_fafsa_pct)

## advising programs at school level
advise <- read_csv(file.path(rdir, 'advising_program_school_clean.csv')) %>%
    setNames(tolower(names(.))) %>%
    unite(advise_org, c('org_1','org_2'), sep = '|') %>%
    mutate(advise_org = gsub('\\|NA$', '', advise_org))

## merge into high school data
hs <- hs %>%
    left_join(dist) %>%
    left_join(advise) %>%
    select(-starts_with('nces_'))

################################################################################
## COMBINE & WRITE
################################################################################

## bind
df <- bind_rows(college, hs) %>%
    ## rename for very small names
    rename(a = instnm,                       # a := name
           b = fips,                         # b := fips
           c = sector,                       # c := sector (college)
           d = enroltot,                     # d := enrollment (hs)
           e = frlpct,                       # e := frpl pct (hs)
           f = csr,                          # f := stu/cou ratio (hs)
           g = district_name,                # g := district name
           h = district_enrollment_grade12,  # h := district enrollment g12
           i = district_frl_pct,             # i := district frpl pct
           j = district_stu_cou_ratio,       # j := district stu/cou ratio
           k = district_fafsa_pct,           # k := district fafsa pct
           l = advise_org,                   # l := hs advising orgs
           m = is_col)                       # m := is college

## set up as SP data frame
lonlat <- df %>% select(lon, lat) %>% as.matrix()
dfsp <- SpatialPointsDataFrame(lonlat, df %>% select(m),
                               proj4string = CRS('+init=epsg:3857'))

## write as geojson
geojson_write(input = dfsp, file = file.path(ddir, 'schools.geojson'))

## write data as minified JS
writeJSArray(df, 's', letters[1:13], file.path(jdir, 'school_array.js'))

## =============================================================================
## END FILE
################################################################################
