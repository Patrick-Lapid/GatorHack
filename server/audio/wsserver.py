import asyncio
from websockets.server import serve
import time
import json
import random

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

def newClient(id):
    clients[id] = {}
    clients[id]["actions"] = [{},{},{}]
    clients[id]["response"] = ""
    clients[id]["id"]=id
    clients[id]["ws"]={}

text = "Our Father, which art in heaven, Hallowed be thy Name. Thy Kingdom come. Thy will be done in earth, As it is in heaven. Give us this day our daily bread. And forgive us our trespasses, As we forgive them that trespass against us. And lead us not into temptation, But deliver us from evil. For thine is the kingdom, The power, and the glory, For ever and ever. Amen.\\nOur Father, which art in heaven, Hallowed be thy Name. Thy Kingdom come. Thy will be done in earth, As it is in heaven. Give us this day our daily bread. And forgive us our trespasses, As we forgive them that trespass against us. And lead us not into temptation, But deliver us from evil. For thine is the kingdom, The power, and the glory, For ever and ever. Amen.\\nOur Father, which art in heaven, Hallowed be thy Name. Thy Kingdom come. Thy will be done in earth, As it is in heaven. Give us this day our daily bread. And forgive us our trespasses, As we forgive them that trespass against us. And lead us not into temptation, But deliver us from evil. For thine is the kingdom, The power, and the glory, For ever and ever. Amen."

#placeholder
async def our_Father(state):
    print("Our Father")
    for i in range(0,len(text)):
        time.sleep(0.1)
        state["response"] = text[0:i]
        
        for websocketId , websocket in state["ws"].items():
            try:
                await websocket.send(f"""{{"type": "streamChars","data": "{state["response"]}"}}""")
            except Exception as e:
                pass
                #print(f"Error sending message: {e}")
                

async def recieve_AudioMessage(state,data):
    print("Revieved Audio Message")
    await our_Father(state)
register_callback("audioMessage", our_Father )

async def recieve_ChatMessage(state,data):
    print("Revieved Chat Message")
    await our_Father(state)
register_callback("chatMessage", recieve_ChatMessage )

async def get_filters(state,data):
    print("Recieved filter parameters")
    exampleData = ["filter", ["BRAND"], ["OS"], ["SPECIAL_OFFERS"], ["PRICE"], ["CONDITION"], ["AVAILABILITY"], ["COLOR"]] #hardcode?
    return exampleData

async def get_filters_tablet(state,data):
    print("Recieved tablet filter parameters")
    return ["filter", data]

async def get_sort_by(state,data):
    print("Recieved Sort Preference")
    print(data)
    return ["sort", data]

async def scroll(state, data):
    print("Received scroll command")
    print(data)
    state["response"] = ["scroll", data]
    await state["ws"].send(f"""{{"type": "streamChars","data": "{state["response"]}"}}""")


async def echo(websocket):
    webSocketId = random.random()
    if clients.get(websocket.remote_address[0] ) is None:
        newClient(websocket.remote_address[0])
    
    clients[websocket.remote_address[0]]["ws"][webSocketId]=websocket
    try:
        async for message in websocket:
            parsedobj = parse_json(message)
            #print(parsedobj)
            print(registry)
            if parsedobj is None:
                print("Error parsing JSON")
                continue
            
            if registry.get(parsedobj["type"]) is not None:
                func = registry[parsedobj["type"]] 
                await func(clients[ websocket.remote_address[0] ],parsedobj["data"])
            
            #for char in text:
            #    time.sleep(0.1)
            #    await websocket.send(f"""{{"type": "streamChars","data": "{char}"}}""")
            #await websocket.send(message)
    except Exception as e:
        print("Connection closed")
    finally:
        await websocket.close()
        clients[id]["ws"].pop(webSocketId)

async def main():
    async with serve(echo, "localhost", 8765):
        await asyncio.Future()  # run forever

asyncio.run(main())
