## libraries
libs <- c('tidyverse', 'geojsonio', 'sp', 'rgdal')
lapply(libs, require, character.only = TRUE)

## paths
ddir <- '../data'
jdir <- '../js'
rdir <- file.path(ddir, '_raw')

## crosswalk
cw <- read_csv(file.path(ddir, 'stcrosswalk.csv'))

## function
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

## -------------------------------------
## COLLEGE
## -------------------------------------

## read in school data
college <- read_csv(file.path(rdir, 'HD2015.zip')) %>%
    setNames(tolower(names(.))) %>%
    select(nm = instnm, fp = fips, sc = sector, lon = longitud, lat = latitude) %>%
    filter(sc %in% c(1,2,4,5),
           fp %in% cw$stfips) %>%
    mutate(lon = as.numeric(lon),
           lat = as.numeric(lat),
           lv = 1,
           en = NA,
           fl = NA,
           cr = NA) %>%
    filter(!is.na(lon),
           !is.na(lat))

## -------------------------------------
## HIGH SCHOOL
## -------------------------------------

## read in school data
hs <- read_csv(file.path(rdir, 'school_level_clean.csv')) %>%
    setNames(tolower(names(.))) %>%
    select(nm = school_name, fp = school_state_fips, lon = school_longitude,
           lat = school_latitude, en = school_enrollment_total,
           fl = school_frl_pct, cr = school_stu_cou_ratio) %>%
    filter(fp %in% cw$stfips) %>%
    mutate(lon = as.numeric(lon),
           lat = as.numeric(lat),
           fp = as.integer(fp),
           sc = NA) %>%
    filter(!is.na(lon),
           !is.na(lat)) %>%
    mutate(lv = 0)

## -------------------------------------
## COMBINE & WRITE
## -------------------------------------

## bind
df <- bind_rows(college, hs) %>%
    ## rename for very small names
    rename(a = nm,                      # a := name
           b = fp,                      # b := fips
           c = sc,                      # c := sector (college)
           d = en,                      # d := enrollment (hs)
           e = fl,                      # e := frpl pct (hs)
           f = cr)                      # f := stu/cou ratio (hs)


## set up as SP data frame
lonlat <- df %>% select(lon, lat) %>% as.matrix()
dfsp <- SpatialPointsDataFrame(lonlat, df %>% select(l = lv),
                               proj4string = CRS('+init=epsg:3857'))

## write as geojson
geojson_write(input = dfsp, file = file.path(ddir, 'schools.geojson'))

## write data as minified JS
writeJSArray(df, 's', letters[1:6], file.path(jdir, 'school_array.js'))


