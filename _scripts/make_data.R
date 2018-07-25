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
ddir <- '../assets/data'
jdir <- '../assets/js'
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
hs <- read_csv(file.path(rdir, 'school_level_clean_2.csv')) %>%
    setNames(tolower(names(.))) %>%
    filter(school_type == '1-Regular school') %>%
    select(nces_id,
           nces_dist_id,
           instnm = school_name,
           fips = school_state_fips,
           lon = school_longitude,
           lat = school_latitude,
           enroltot = school_enrollment_total,
           frlpct = school_frl_pct,
           csr = school_student_counselor_ratio,
           charter,
           magnet) %>%
    mutate(fips = as.integer(fips)) %>%
    filter(fips %in% cw$stfips) %>%
    mutate(instnm = str_to_title_mod(instnm),
           lon = as.numeric(lon),
           lat = as.numeric(lat)) %>%
    filter(!is.na(lon),
           !is.na(lat))

hs_imp <- hs %>%
    group_by(fips) %>%
    summarise(csr_mean = mean(csr, na.rm = TRUE)) %>%
    ungroup()

## advising programs at school level
advise_tmp <- read_csv(file.path(rdir, 'advising_program_school_clean.csv')) %>%
    setNames(tolower(names(.))) %>%
    mutate(trio_subprogram = ifelse(trio_subprogram == 'N/A', NA,
                                    trio_subprogram)) %>%
    ## need to make wide
    arrange(nces_id) %>%
    group_by(nces_id) %>%
    mutate(count = seq(n())) %>%
    rename(org_1 = organization_name,
           div_1 = division_name,
           tri_1 = trio_subprogram,
           web_1 = website) %>%
    mutate(org_2 = ifelse(count == 2, org_1, NA),
           div_2 = ifelse(count == 2, div_1, NA),
           tri_2 = ifelse(count == 2, tri_1, NA),
           web_2 = ifelse(count == 2, web_1, NA),
           org_3 = ifelse(count == 3, org_1, NA),
           div_3 = ifelse(count == 3, div_1, NA),
           tri_3 = ifelse(count == 3, tri_1, NA),
           web_3 = ifelse(count == 3, web_1, NA),
           org_4 = ifelse(count == 4, org_1, NA),
           div_4 = ifelse(count == 4, div_1, NA),
           tri_4 = ifelse(count == 4, tri_1, NA),
           web_4 = ifelse(count == 4, web_1, NA),
           org_5 = ifelse(count == 5, org_1, NA),
           div_5 = ifelse(count == 5, div_1, NA),
           tri_5 = ifelse(count == 5, tri_1, NA),
           web_5 = ifelse(count == 5, web_1, NA),
           org_6 = ifelse(count == 6, org_1, NA),
           div_6 = ifelse(count == 6, div_1, NA),
           tri_6 = ifelse(count == 6, tri_1, NA),
           web_6 = ifelse(count == 6, web_1, NA),
           org_7 = ifelse(count == 7, org_1, NA),
           div_7 = ifelse(count == 7, div_1, NA),
           tri_7 = ifelse(count == 7, tri_1, NA),
           web_7 = ifelse(count == 7, web_1, NA),
           org_8 = ifelse(count == 8, org_1, NA),
           div_8 = ifelse(count == 8, div_1, NA),
           tri_8 = ifelse(count == 8, tri_1, NA),
           web_8 = ifelse(count == 8, web_1, NA))

advise <- advise_tmp %>%
    filter(count == 1) %>%
    select(nces_id, ends_with('_1')) %>%
    left_join(advise_tmp %>%
              filter(count == 2) %>%
              select(nces_id, ends_with('_2')), by = 'nces_id') %>%
    left_join(advise_tmp %>%
              filter(count == 3) %>%
              select(nces_id, ends_with('_3')), by = 'nces_id') %>%
    left_join(advise_tmp %>%
              filter(count == 4) %>%
              select(nces_id, ends_with('_4')), by = 'nces_id') %>%
    left_join(advise_tmp %>%
              filter(count == 5) %>%
              select(nces_id, ends_with('_5')), by = 'nces_id') %>%
    left_join(advise_tmp %>%
              filter(count == 6) %>%
              select(nces_id, ends_with('_6')), by = 'nces_id') %>%
    left_join(advise_tmp %>%
              filter(count == 7) %>%
              select(nces_id, ends_with('_7')), by = 'nces_id') %>%
    left_join(advise_tmp %>%
              filter(count == 8) %>%
              select(nces_id, ends_with('_8')), by = 'nces_id') %>%
    unite(advise_org, starts_with('org_'), sep = '|') %>%
    mutate(advise_org = gsub('NA', '', advise_org)) %>%
    unite(advise_div, starts_with('div_'), sep = '|') %>%
    mutate(advise_div = gsub('NA', '', advise_div)) %>%
    unite(advise_tri, starts_with('tri_'), sep = '|') %>%
    mutate(advise_tri = gsub('NA', '', advise_tri)) %>%
    unite(advise_web, starts_with('web_'), sep = '|') %>%
    mutate(advise_web = gsub('NA', '', advise_web))

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
    rename(advise_org = organization_name,
           advise_div = division_name,
           advise_web = website)

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
    drop_na(lon)

################################################################################
## COMBINE & WRITE
################################################################################

## bind for primary data set
df <- bind_rows(college, hs, community)

## -------------------------------------
## JSON
## -------------------------------------

df <- df %>%
    mutate(z = row_number(),                 # redundant id #
           cat = as.integer(cat)) %>%
    ## rename for very small names
    rename(a = cat,                          # a := category
           b = instnm,                       # b := name
           c = fips,                         # c := fips
           d = enroltot,                     # d := enrollment (hs)
           e = frlpct,                       # e := frpl pct (hs)
           f = csr,                          # f := stu/cou ratio (hs)
           g = csr_flag,                     # g := missing csr
           h = zip,                          # h := zip code
           i = advise_org,                   # i := organization name
           j = advise_div,                   # h := division name
           k = advise_tri,                   # i := trio subprogram
           l = advise_web,                   # l := website
           m = magnet,                       # m := magnet (hs)
           n = charter)                      # n := charter (hs)

## split by schools/community and college
df_coll <- df %>% filter(a %in% c(5:8))
df_icon <- df %>% filter(a %in% c(0:4,9))

## set up as SP data frame
lonlat_coll <- df_coll %>% select(lon, lat) %>% as.matrix()
dfsp_coll <- SpatialPointsDataFrame(lonlat_coll, df_coll %>% select(z),
                                    proj4string = CRS('+init=epsg:3857'))
lonlat_icon <- df_icon %>% select(lon, lat) %>% as.matrix()
dfsp_icon <- SpatialPointsDataFrame(lonlat_icon, df_icon %>% select(z),
                                    proj4string = CRS('+init=epsg:3857'))

## write as geojson
geojson_write(input = dfsp_coll, file = file.path(ddir, 'college.geojson'))
geojson_write(input = dfsp_icon, file = file.path(ddir, 'icon.geojson'))

## write all data as minified JS
writeJSArray(df, 's', letters[1:14], file.path(jdir, 'all_icon_array.js'))

## for tileset
geojson_write(input = df, file = file.path(ddir, 'full_data.geojson'))

## -------------------------------------
## CSV
## -------------------------------------

## rebind for primary data set
df <- bind_rows(college, hs, community)

df <- df %>%
    mutate(type = case_when(
               cat %in% 1:4 ~ 'high school',
               cat %in% 5:8 ~ 'college',
               cat == 9 ~ 'community')
           ) %>%
    separate(advise_org, paste0('advise_org_', 1:8), sep = '\\|',
             extra = 'merge', fill = 'right') %>%
    separate(advise_div, paste0('advise_div_', 1:8), sep = '\\|',
             extra = 'merge', fill = 'right') %>%
    separate(advise_tri, paste0('advise_tri_', 1:8), sep = '\\|',
             extra = 'merge', fill = 'right') %>%
    separate(advise_web, paste0('advise_web_', 1:8), sep = '\\|',
             extra = 'merge', fill = 'right') %>%
    mutate_at(vars(contains('advise_')),
              funs(ifelse(. == '', NA, .))) %>%
    select(-csr_flag, -csr_mean, -cat, -advise_org_8, -advise_div_8,
           -advise_tri_6, -advise_tri_7, -advise_tri_8, -advise_web_8) %>%
    select(type, instnm, zip, fips, lon, lat, enroltot, frlpct, csr,
           magnet, charter,
           contains('advise_org'), contains('advise_div'),
           contains('advise_tri'), contains('advise_web'))

## write
write_csv(df, file.path(ddir, 'map_data.csv'))

## =============================================================================
## END FILE
################################################################################
