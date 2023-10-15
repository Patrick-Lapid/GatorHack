import asyncio
from websockets.server import serve
import time

text = "Our Father, which art in heaven, Hallowed be thy Name. Thy Kingdom come. Thy will be done in earth, As it is in heaven. Give us this day our daily bread. And forgive us our trespasses, As we forgive them that trespass against us. And lead us not into temptation, But deliver us from evil. For thine is the kingdom, The power, and the glory, For ever and ever. Amen.\nOur Father, which art in heaven, Hallowed be thy Name. Thy Kingdom come. Thy will be done in earth, As it is in heaven. Give us this day our daily bread. And forgive us our trespasses, As we forgive them that trespass against us. And lead us not into temptation, But deliver us from evil. For thine is the kingdom, The power, and the glory, For ever and ever. Amen.\nOur Father, which art in heaven, Hallowed be thy Name. Thy Kingdom come. Thy will be done in earth, As it is in heaven. Give us this day our daily bread. And forgive us our trespasses, As we forgive them that trespass against us. And lead us not into temptation, But deliver us from evil. For thine is the kingdom, The power, and the glory, For ever and ever. Amen."

async def echo(websocket):
    async for message in websocket:
        print(message)
        
        for char in text:
            time.sleep(0.1)
            await websocket.send(f"""{{"type": "streamChars","data": "{char}"}}""")
        #await websocket.send(message)

async def main():
    async with serve(echo, "localhost", 8765):
        await asyncio.Future()  # run forever

asyncio.run(main())
