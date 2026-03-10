import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import pickle
import os

def train_model():
    base_dir = os.path.dirname(__file__)
    df = pd.read_csv(os.path.join(base_dir, '..', 'RawData', 'Data_SentClass1.csv'))
    #X & y's
    X = df['Comments']
    y = df['Sentiment']
    #Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    #Build pipeline
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(max_features=5000)),
        ('clf', LogisticRegression(max_iter=1000))
    ])
    #train
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    print(classification_report(y_test, y_pred))
    #save model
    model_path = os.path.join(base_dir, 'model.pkl')
    