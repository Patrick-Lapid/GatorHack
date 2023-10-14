# example : python AudioToText.py voice_to_text audio_files/voice.mp4
#  AudioToText.py text_to_voice "Hello today is a very nice day i love tesla very much" voice_outputs/tt.mp3

import sys
import os

# Voice to Text
try:
    import whisper
except ImportError:
    raise SystemExit("Install whisper with pip install -U openai-whisper")

model = whisper.load_model("base")

def AudioToText(file):
    result = model.transcribe(file)
    return result["text"]

# Text to Voice
try:
    from gtts import gTTS
except ImportError:
    raise SystemExit("Install gTTs with pip install gTTS")

def TextToVoice(text, output_file):
    output_path = os.path.join(os.getcwd(), output_file)
    tts = gTTS(text=text)
    tts.save(output_path)

def main():
    if len(sys.argv) < 2:
        print("Please specify a function type and relevant arguments.")
        sys.exit(1)

    function_type = sys.argv[1]
    
    if function_type == "voice_to_text":
        if len(sys.argv) != 3:
            print("Usage for voice to text: python script_name.py voice_to_text audio_input_file")
            sys.exit(1)
        input_file = sys.argv[2]
        text_result = AudioToText(input_file)
        print(text_result)

    elif function_type == "text_to_voice":
        if len(sys.argv) != 4:
            print("Usage for text to voice: python script_name.py text_to_voice 'input_text' output_audio_file")
            sys.exit(1)
        input_text = sys.argv[2]
        output_file = sys.argv[3]
        TextToVoice(input_text, output_file)
        print(f"Voice saved to {output_file}")

    else:
        print("Invalid function type. Choose either 'voice_to_text' or 'text_to_voice'")
        sys.exit(1)

if __name__ == "__main__":
    main()
