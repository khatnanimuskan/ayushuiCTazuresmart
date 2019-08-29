from django.test import TestCase
import json
import os
from AzureSite.settings import BASE_DIR
import glob



def read_json_attributes():
    adf_path = str(os.path.join(BASE_DIR+ '\ADFParameters.json')).replace('\\', '/')
    vault_path = str(os.path.join(BASE_DIR+ '\KeyVaultParameters.json')).replace('\\', '/')

    with open(adf_path) as file:
        ADFParameters = json.load(file)

    with open(vault_path) as file:
        KeyVaultParameters = json.load(file)

    return list(ADFParameters['parameters'].keys()), list(KeyVaultParameters['parameters'].keys())

path = str(os.path.join(BASE_DIR+ '\AzureSite\sections.json')).replace('\\', '/')
with open(path) as file:
    data = json.load((file))
test = []
for i in range(len(data['sections'])):
   # print(data['sections'][i].keys())
    attributes = data['sections'][i]['sectionAttributes']

    for j in range(len(attributes)):
       pass
       # print(attributes[j]['internalName'])
    if i==2:
        sub = data['sections'][i]['subsections']
        #print('sub', sub['sections'].keys())

        for j in (sub['sections'].keys()):
            #print(sub['sections'][j])
            temp = sub['sections'][j]['subsectionAttributes']
            for k in range(len(temp)):
                print(temp[k]['internalName'])
                test.append(temp[k]['internalName'])

print(test)