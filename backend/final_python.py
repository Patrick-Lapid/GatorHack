import requests
import openai
import pandas as pd
import numpy as np
import pinecone
import json

openai.api_key = "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"
summmary_df = pd.read_csv("summary_embeddings.csv")

actions = [
    [
        "scroll", "GLOBAL", 
        {
            "name": "scroll",
            "description": "Scroll the screen",
            "parameters" : {
                "type": "object",
                "properties": {
                    "direction": {
                        "type": "string",
                        "enum": ["Up", "Down"],
                        "description": "The direction to move in the screen. Moves either up or down"
                    }
                },
                "required":["direction"]
            }
        }
    ],
    [
        "search", "GLOBAL",
        {
            "name": "search",
            "description": "Search for some product in Verizon",
            "parameters" : {
                "type": "object",
                "properties": {
                    "product": {
                        "type": "string",
                        "enum": ["Personal Phone", "Business Phone", "Tablets & Laptops"],
                        "description": "The product to search",
                    }
                },
                "required":["product"]
            }
        }
    ],
    [
        "get_filter", "LOCAL_PER_PHONE",
        {
            "name": "get_filters",
            "description": "Parameters to filter phones",
            "parameters": {
                "type": "object",
                "properties": {
                    "brand": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": ["Apple", "Samsung", "Google", "Motorola", "Kyocera", "Nokia", "TCL", "Sonim"]
                        }
                    },
                    "os": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": ["Android", "Apple iOS"]
                        }
                    },
                    "special_offers": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": ["Bill Credit", "Trade In"]
                        }
                    },
                    "price": {
                        "type": "array",
                        "items": {
                            "type": "integer"
                        },
                        "description": "size 2 array with the price lower bound (index 0) and upper bound (index 1)"
                    },
                    "condition": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": ["New", "Certified Pre-Owned"]
                        }
                    },
                    "availability": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": ["Exclude Out Of Stock"]
                        }
                    },
                    "color": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": ["Black", "White", "Blue", "Green", "Gray", "Purple", "Red", "Pink", "Silver", "Gold", "Yellow", "Brown", "Metallic"]
                        }
                    }
                }
            }
        }
    ],
    [
        "get_sort_by", "LOCAL_PER_PHONE",
        {
            "name": "get_sort_by",
            "description": "Parameters to sort the products",
            "parameters" : {
                "type": "object",
                "properties": {
                    "sort_by": {
                        "type": "string",
                        "enum": ["Featured", "Best Sellers", "Newest", "Price Low to High", "Price High to Low"]
                    },
                },
                "required":["sort_by"],
            },
        }
    ],
    [
        "get_filter", "LOCAL_TABLET",
        ###FIXME### Put in the correct function call (change from business to regular)
        {
            "name": "get_filters_tablet",
            "description": "Get the parameters to filter tablets and laptops",
            "parameters": {
                "type": "object",
                "properties": {
                    "brand": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": ["Apple", "Orbic", "Samsung", "TCL"]
                        }
                    },
                    "payment_type": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": ["2 Year Contact Pricing", "Device Payment"]
                        }
                    },
                    "price": {
                        "type": "array",
                        "items": {
                            "type": "integer"
                        },
                        "description": "size 2 array with the price lower bound (index 0) and upper bound (index 1)"
                    },
                    "color": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": ["Black", "White", "Blue", "Green", "Gray", "Purple", "Red", "Pink", "Silver", "Gold", "Yellow"]
                        }
                    }
                },
                "required": ["brand", "payment_type", "price", "color"]
            }
        }
    ],
    [
        "get_sort_by", "LOCAL_TABLET",
        {
            "name": "get_sort_by",
            "description": "Parameters to sort the products",
            "parameters" : {
                "type": "object",
                "properties": {
                    "sort_by": {
                        "type": "string",
                        "enum": ["Featured", "Best Sellers", "Newest", "Price Low to High", "Price High to Low"]
                    },
                },
                "required":["sort_by"],
            },
        }
    ]
]
###FIXME###
action_df = pd.DataFrame(actions, columns=['function_name', 'local_state', 'openai_func_call'])
###FIXME### create df of: |search|local_state|url|
page_nav = [
    [

    ]


] 

def create_embedding(text):
    '''Create embeddings using ada-002'''

    response = openai.Embedding.create(
      model="text-embedding-ada-002",
      input=text
    )
    return response['data'][0]['embedding']

def generate_summary(q, context):
    '''Generate summary using query and context
    Serves as helper for summarize function
    Uses GPT-3.5-turbo with 16K context window'''

    query = f'''Given the provided #context#, summarize the answer to the user's #query# in under 200 words. Rely primarily on the #context# for the response.

###QUERY###
{q}

###CONTEXT###
{context}'''
    
    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo-16k", messages=[{"role": "user", "content": query}], temperature=0.3)
    print(completion)###FIXME### Create log instead of printing
    return completion.choices[0].message.content

def summarize(query):
    '''Create a summary based on a user query'''

    #Get context from Vector DB
    pinecone.init(api_key="e7cb6b9a-88f4-46f9-a154-68a9f5feef72", environment="gcp-starter")
    vecdb = pinecone.Index("summarization")
    query_embedding = create_embedding(query) #vector embedding of query
    matches = vecdb.query(
        top_k=10,
        include_values=False,
        vector=query_embedding
    )
    ids = [int(x['id']) for x in matches['matches']] #ids of top k matches
    #context from topk using page raw text
    queried_dfs = summmary_df[summmary_df['id'].isin(ids)]
    context = ""
    for idx, r in queried_dfs.iterrows():
        context+=r['raw text']
    summary = generate_summary(query, context)
    links = [r['url'] for idx, r in queried_dfs.iterrows()]
    return (summary, links)

def intent_detection(query):
    '''Get intent from given query'''

    query = f'''Given the user query "#QUERY#", identify the intent and provide a response in the format: {{intent: INTENT, action: ACTION}}. 
The possible #INTENT# values are:
- Information: Where the user is seeking an explanation, summary, or information.
- Action: Where the user intends to perform an action, like filtering, sorting, navigating etc.
- None: If there's no discernible intent.

If the #INTENT# is "Action", further describe the specific intent in #ACTION#. Some examples of navigation might be: "navigate to xyz.com", "show all phones", "scroll up" etc.

For instance, the query "Show me all iPhones in red color" would have a response as {{"intent": "Action", "action": "Show me phones"}}.

#QUERY#: "{query}"'''
    
    intent = openai.Completion.create(model="gpt-3.5-turbo-instruct", prompt=query, temperature=0.1)
    return intent.choices[0].text[2:]

def get_action(query, local_state):
    query = f'''For the following user #QUERY#, use function calling to see if a function should be used or not. If no function is used, return NONE

###QUERY###
{query}'''
    
    while True:
        action_not_hit = True
        #Local Action
        if local_state in local_state_df:

            pass
        #Global Action if 1. local action not hit 2. local action not available
        if action_not_hit:
            pass


def main_entry_function(query, local_state):
    '''Main usable function for singular query'''
    #Get intent
    query_intent = json.loads(intent_detection(query))
    #Conditional Statament
    if query_intent["intent"] == "Information":
        info = summarize(query)
    elif query_intent["intent"] == "Action":
        query_intent_action = query_intent['action']
        action = get_action(query, local_state)
    else:
        pass