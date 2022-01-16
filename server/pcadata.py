import pandas as pd

#Load data from sklearn into tuple
from sklearn.datasets import load_breast_cancer
cancer = load_breast_cancer()

# Get keys for the dataset
cancer.keys()

#Load data and markers to panda
df = pd.DataFrame(cancer['data'], columns=cancer['feature_names'])
df.columns = df.columns.str.replace(' ', '')
print(df.head())

from sklearn.preprocessing import StandardScaler 
scaler = StandardScaler(copy=True, with_mean=True, with_std=True)
print(scaler.fit(df))

dTarget=cancer['target']
dfTarget = pd.DataFrame(cancer['target'], columns=['target'])
#(569,30)
scaled_data = scaler.transform(df)

#Create two component PCA
from sklearn.decomposition import PCA
pca = PCA(n_components=2, whiten=False, copy=True, random_state=0)
pca.fit(scaled_data)

#(569,2)
x_pca = pca.transform(scaled_data)
x_pca =-x_pca

#XY values for used by API
PCAxyxValues = x_pca.tolist()

#Push data to Sqlite database cancer.db
import sqlite3
conn = sqlite3.connect("database/cancer.db")
df.to_sql('patientdata', conn, if_exists='replace')  
dfTarget.to_sql('patientclass', conn, if_exists='replace')  



