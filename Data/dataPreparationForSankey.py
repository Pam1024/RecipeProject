import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import re
from math import isnan
import sys,os

## The code below is used to process raw data and create dataset that consists of
## recipe ingredients that are stemmed and sorted withing ingredient:

##df_original = pd.read_csv(r'..\Data\cuisine_version2.csv')
##df = df_original.copy(deep = True)
##
##df.drop(['id','recipeName', 'PrepTime','img','flavors', 'bow'], axis= 1, inplace=True)
##
##def splitToList(stringValue):
##    ## strip [] {} parentheses:
##    stringValue = stringValue.replace(', ',',')
##    stringValue = stringValue.replace('\'','')
##    stringValue = stringValue[1:-1]
##    splitted = []
##    for string in stringValue.split(","):
##        splitted.append(string.strip())
##    return splitted
##
##df['ingredients'] = df['ingredients'].apply(splitToList)
##
##import nltk
##
##import spacy
##spcy = spacy.load('en_core_web_lg')
##
##from nltk.stem import PorterStemmer
##ps = PorterStemmer()
##
##def makeIngredientsStemmedNouns(ingredients):
##    ingredientsOnlyNouns = []
##    for ingredient in ingredients:
##        nouns = [ps.stem(ent.text) for ent in spcy(ingredient) if ent.pos_ == 'NOUN']
##        nouns.sort()
##        ingredientsOnlyNouns += [' '.join(nouns)]
##    return ingredientsOnlyNouns
##
##
##df['ingredients'] = df['ingredients'].apply(makeIngredientsStemmedNouns)
##
##from sklearn.preprocessing import MultiLabelBinarizer
##mlb = MultiLabelBinarizer()
##
##ingredients_mlb = mlb.fit_transform(df['ingredients'])
##
##df_prepcocessed = df.join(pd.DataFrame(ingredients_mlb,
##                          columns=mlb.classes_,
##                          index=df.index))
##
##df = df_prepcocessed.copy('deep')
##
###### we don't need the 'ingredients' column anymore.
###### we also remove the '' column that was inserted because
###### the function makeIngredientsStemmedNouns() returns list that contains ''
###### in cases when some ingredient does not contain a noun (for example, if
###### ingredient is 'seasoning', that function will return '' because nltk.pos_tag
###### will tag it as 'VBG')
##df.drop(['ingredients', ''], axis= 1, inplace=True)
##df.to_csv("D:\Studies\DalhousieUniversity\Summer2019\VisualAnalytics\Project\RecipeProject\Data\stemmed_noun_ingredients.csv")

## stemmed_noun_ingredients.csv file was created using the code above.
df_original = pd.read_csv(r'..\Data\stemmed_noun_ingredients.csv')

df_cuisine = df['cuisine']
df_ingredients = df.drop(['cuisine'], axis= 1)

## Drop columns that contai only one '1' (meaning that this ingredient is used only by one recipe)
dropped_columns = []
df_only_shared_ing = df_ingredients
##for col in df_only_shared_ing.columns:
##    if len(df[df[col] == 1]) <= 1200:
##        dropped_columns.append(col)
##        df_only_shared_ing = df_only_shared_ing.drop(col,axis=1)

from sklearn.cluster import KMeans
import math
number_of_clusters = int(math.sqrt((len(df_only_shared_ing.index)/2)))
kmeans = KMeans(n_clusters=number_of_clusters, n_init = 10, n_jobs = -1).fit(df_only_shared_ing)
mp = {}
for label in kmeans.labels_:
    if label not in mp.keys():
        mp[label] = 1
    else:
        mp[label] += 1


cuisine_vs_cluster = pd.DataFrame(df_cuisine).join(pd.DataFrame(kmeans.labels_,
                          columns=['cluster'],
                          index=pd.DataFrame(df_cuisine).index))



cuisines = cuisine_vs_cluster.cuisine.unique()
clustNumToCuisineToCount = dict.fromkeys(range(0,number_of_clusters,1))

for clustNum in clustNumToCuisineToCount.keys():
    clustNumToCuisineToCount[clustNum] = dict.fromkeys(cuisines)

for index, row in cuisine_vs_cluster.iterrows():
    if clustNumToCuisineToCount[row['cluster']][row['cuisine']] == None:
        clustNumToCuisineToCount[row['cluster']][row['cuisine']] = 1
    else:
        clustNumToCuisineToCount[row['cluster']][row['cuisine']] += 1


##remainingCuisines = list(cuisines)
cuisineToCuisineToPercentage = dict.fromkeys(cuisines)
for cuisine in cuisineToCuisineToPercentage.keys():
    remainingCuisines = list(cuisines)
    remainingCuisines.remove(cuisine)
    cuisineToCuisineToPercentage[cuisine] = dict.fromkeys(remainingCuisines)

for cuisine in cuisineToCuisineToPercentage.keys():
    for otherCuisine in cuisineToCuisineToPercentage[cuisine].keys():
        cuisineToCuisineToPercentage[cuisine][otherCuisine] = 0

for cuisine in cuisineToCuisineToPercentage.keys():
    for clustNum in clustNumToCuisineToCount.keys():
        cluster = clustNumToCuisineToCount[clustNum]
        if(cuisine not in cluster.keys()):
            continue
        otherCuisines = list(cluster.keys())
        otherCuisines.remove(cuisine)
        for otherCuisine in otherCuisines:
            if(cluster[otherCuisine] != None and cluster[cuisine] != None and
                    otherCuisine in cuisineToCuisineToPercentage[cuisine].keys()):
                cuisineToCuisineToPercentage[cuisine][otherCuisine] += \
                                 min(cluster[cuisine], cluster[otherCuisine])


## initialize map with zeros
referenceCount = dict.fromkeys(cuisines)
for cuisine in referenceCount.keys():
    referenceCount[cuisine] = 0

for cuisine_outer in cuisineToCuisineToPercentage.keys():
    for cuisine_inner in cuisineToCuisineToPercentage[cuisine_outer].keys():
        referenceCount[cuisine_outer] += cuisineToCuisineToPercentage[cuisine_outer][cuisine_inner]


for cuisine_outer in cuisineToCuisineToPercentage.keys():
    for cuisine_inner in cuisineToCuisineToPercentage[cuisine_outer].keys():
        if cuisineToCuisineToPercentage[cuisine_outer][cuisine_inner] < referenceCount[cuisine_outer] / 19:
            cuisineToCuisineToPercentage[cuisine_outer][cuisine_inner] = 0

sortedByValues = sorted(referenceCount.items(), key = lambda kv:(kv[1], kv[0]))

cuisineNameToID_left = dict().fromkeys(cuisineToCuisineToPercentage.keys())
idd = 0
for name in cuisineNameToID_left.keys():
    cuisineNameToID_left[name] = idd
    idd += 1

nodes = "\"nodes\": ["
for name in cuisineNameToID_left.keys():
    string = "{\"id\": " + str(cuisineNameToID_left[name]) + ",\"name\": \"" + name + "\"},"
    nodes += string

cuisineNameToID_right = dict().fromkeys(cuisineToCuisineToPercentage.keys())
for name in cuisineNameToID_right.keys():
    cuisineNameToID_right[name] = idd
    idd += 1

for name in cuisineNameToID_right.keys():
    string = "{\"id\": " + str(cuisineNameToID_right[name]) + ",\"name\": \"" + name + "\"},"
    nodes += string

## remove last comma:
nodes = nodes[:-1] + "]"

links = "\"links\": ["
for cuisine_left in cuisineNameToID_left.keys():
    for cuisine_right in cuisineNameToID_right.keys():
        if(cuisine_left != cuisine_right):
            string = "{\"source\": " + str(cuisineNameToID_left[cuisine_left]) + \
                ",\"target\": " + str(cuisineNameToID_right[cuisine_right]) + \
                ",\"value\": " + str(cuisineToCuisineToPercentage[cuisine_left][cuisine_right]) + "},"
            links += string

## remove last comma:
links = links[:-1] + "]"

jsonString = "{" + nodes + "," + links + "}"

text_file = open(r'D:\Studies\DalhousieUniversity\Summer2019\VisualAnalytics\Project\RecipeProject\Data\sankeyJson.json', "w")
text_file.write(jsonString)
text_file.close()

maxx = 0
for cuisine_outer in cuisineToCuisineToPercentage.keys():
    for cuisine_inner in cuisineToCuisineToPercentage[cuisine_outer].keys():
        if cuisineToCuisineToPercentage[cuisine_outer][cuisine_inner] > maxx:
            maxx = cuisineToCuisineToPercentage[cuisine_outer][cuisine_inner]

minn = 1000
for cuisine_outer in cuisineToCuisineToPercentage.keys():
    for cuisine_inner in cuisineToCuisineToPercentage[cuisine_outer].keys():
        if cuisineToCuisineToPercentage[cuisine_outer][cuisine_inner] < minn and \
            cuisineToCuisineToPercentage[cuisine_outer][cuisine_inner] != 0:
            minn = cuisineToCuisineToPercentage[cuisine_outer][cuisine_inner]




