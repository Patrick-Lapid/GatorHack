import asyncio
from websockets.server import serve
import time
import json
import random
from final_python import main_entry_function
def parse_json(json_string):
    try:
        python_map = json.loads(json_string)
        return python_map
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return None

# Create a dictionary to act as the registry
registry = {}

# Define the registerType function
# callback takes two arguements: the client state and the data from the client
def register_callback(s, callback):
    registry[s] = callback

clients = {}

#this is a map which takes a key which is a ip concatenated with a url and holds a function which takes a websocket
followups = {}

followups["127.0.0.1:https://musescore.com/user/16006641/sheetmusic"] = lambda x: print("hello")

def newClient(id):
    clients[id] = {}
    clients[id]["actions"] = [{}]
    clients[id]["response"] = ""
    clients[id]["id"]=id
    clients[id]["url"]=""
    clients[id]["ws"]={}

text = "Our Father, which art in heaven, Hallowed be thy Name. Thy Kingdom come. Thy will be done in earth, As it is in heaven. Give us this day our daily bread. And forgive us our trespasses, As we forgive them that trespass against us. And lead us not into temptation, But deliver us from evil. For thine is the kingdom, The power, and the glory, For ever and ever. Amen."
#placeholder
async def our_Father(state):
    print("Our Father")
    for i in range(0,len(text)):
        #time.sleep(0.1)
        state["response"] = text[0:i]
        
        websocket = state["ws"]
        try:
            
            await websocket.send(f"""{{"type": "streamChars","data": "{state["response"]}"}}""")
        except Exception as e:
            pass
            #print(f"Error sending message: {e}")
                

async def recieve_AudioMessage(state,data):
    print("Revieved Audio Message")
    await our_Father(state)
register_callback("audioMessage", our_Father )

test_summary = {
    "type" : "summary",
    "message": "Ooga Booga",
    "link": ["google.com","bing.com"]
}

test_action = {
    "type" : "action",
    "action" : {
        "act" : "scroll",
        "act_list" : "down"
    }
}

async def recieve_ChatMessage(state,data):
    print("Revieved Chat Message")
    #await our_Father(state)
    x = main_entry_function(data, state['url'])

    #deprecated
    #print(x)
    #state['response'] = x[0]
    #websocket = state["ws"]

    #x will look like such:
    #{
    #type: "",
    #message: "",
    #link: [],
    #action: {
    #        act: "",
    #        act_list: []
    #    }
    #}

    

    
    try:
        if x['type'] == 'summary':
            #state["response"] = 
            await websocket.send(f"""{{"type": "streamChars","data": "{ x['message'] }"}}""")
            record = {
                "type": "summaryResponse",
                "data": {
                    "summary": x['message'],
                    "links": x['link']
                },
            }
            await websocket.send(json.dumps(record))
        if x['type'] == 'action':
            record = {
                "type": "actionResponse",
                "data": x['action']
            }
            await websocket.send(json.dumps(record))

    except Exception as e:
        pass
        print(f"Error sending message: {e}")
register_callback("chatMessage", recieve_ChatMessage )

#Needed? 
# async def get_filters(state,data):
#     print("Recieved filter parameters")
#     exampleData = []
#     return exampleData

# async def get_filters_tablet(state,data):
#     print("Recieved tablet filter parameters")
#     return ["filter", data]

# async def get_sort_by(state,data):
#     print("Recieved Sort Preference")
#     print(data)
#     return ["sort", data]

async def scroll(state, data):
    print("Received scroll command")
    print(data)
    state["response"] = data
    await state["ws"].send(f"""{{"type": "scroll","data": "{state["response"]}"}}""")


async def echo(websocket):
    webSocketId = random.random()
    
    newClient(webSocketId)
    clients[webSocketId]["ws"]=websocket
    #set the ip field to the ip address
    clients[webSocketId]["ip"]=websocket.remote_address[0]

    try:
        async for message in websocket:
            asyncio.create_task(handle_message(message, websocket, webSocketId))
    except Exception as e:
        print("Connection closed")
    finally:
        await websocket.close()
        clients[id]["ws"].pop(webSocketId)


async def handle_message(message, websocket, webSocketId):
    parsedobj = parse_json(message)
    if parsedobj is None:
        print("Error parsing JSON")
        return

    if parsedobj["type"] == "register":
            obj = parsedobj["data"]
            print("Registering")
            
            clients[webSocketId]["url"] = obj["url"]

            tag = clients[webSocketId]["ip"]+":"+clients[webSocketId]["url"]
            print(tag)
            if followups.get(tag) is not None:
                func = followups[tag]
                await func(websocket)
    else:
        if registry.get(parsedobj["type"]) is not None:
            func = registry[parsedobj["type"]] 
            await func(clients[webSocketId],parsedobj["data"])



async def main():
    async with serve(echo, "localhost", 8765):
        await asyncio.Future()  # run forever

asyncio.run(main())
