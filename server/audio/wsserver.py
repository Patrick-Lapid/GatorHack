import asyncio
from websockets.server import serve
import time
import json

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

def newClient(id,ws):
    clients[id] = {}
    clients[id]["response"] = ""
    clients[id]["id"]=id
    clients[id]["ws"]=ws

text = "Our Father, which art in heaven, Hallowed be thy Name. Thy Kingdom come. Thy will be done in earth, As it is in heaven. Give us this day our daily bread. And forgive us our trespasses, As we forgive them that trespass against us. And lead us not into temptation, But deliver us from evil. For thine is the kingdom, The power, and the glory, For ever and ever. Amen.\nOur Father, which art in heaven, Hallowed be thy Name. Thy Kingdom come. Thy will be done in earth, As it is in heaven. Give us this day our daily bread. And forgive us our trespasses, As we forgive them that trespass against us. And lead us not into temptation, But deliver us from evil. For thine is the kingdom, The power, and the glory, For ever and ever. Amen.\nOur Father, which art in heaven, Hallowed be thy Name. Thy Kingdom come. Thy will be done in earth, As it is in heaven. Give us this day our daily bread. And forgive us our trespasses, As we forgive them that trespass against us. And lead us not into temptation, But deliver us from evil. For thine is the kingdom, The power, and the glory, For ever and ever. Amen."


async def our_Father(state,data):
    print("Our Father")
    for i in range(0,len(text)):
            state["response"] = text[0:i]
            time.sleep(0.1)
            await state["ws"].send(f"""{{"type": "streamChars","data": "{state["response"]}"}}""")

#placeholder
register_callback("audioMessage", our_Father )

async def echo(websocket):
    async for message in websocket:
        parsedobj = parse_json(message)
        #print(parsedobj)
        print(registry)
        if parsedobj is None:
            print("Error parsing JSON")
            continue
        if parsedobj["type"] == "register":
            print("Registering client")
            if clients.get(parsedobj["id"]) is None:
                newClient(parsedobj["id"],websocket)
            else:
                clients[parsedobj["id"]]["ws"]=websocket
            print(clients)
        else:
            if registry.get(parsedobj["type"]) is not None:
                func = registry[parsedobj["type"]] 
                await func(clients[ parsedobj["id"] ],parsedobj["data"])
        
        #for char in text:
        #    time.sleep(0.1)
        #    await websocket.send(f"""{{"type": "streamChars","data": "{char}"}}""")
        #await websocket.send(message)

async def main():
    async with serve(echo, "localhost", 8765):
        await asyncio.Future()  # run forever

asyncio.run(main())
