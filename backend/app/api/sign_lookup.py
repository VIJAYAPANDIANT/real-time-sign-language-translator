from fastapi import APIRouter, Query
from typing import List
from pydantic import BaseModel
import re

router = APIRouter()

class SignSequenceItem(BaseModel):
    type: str  # 'word' or 'letter'
    text: str
    url: str

KNOWN_WORDS = {
    "hello", "please", "thank you", "yes", "no", "help"
}

@router.get("/", response_model=List[SignSequenceItem])
async def lookup_signs(text: str = Query(..., description="Text to translate to sign sequence")):
    """
    Takes an input string, tokenizes it into words, and returns a sequence of 
    URLs (images/videos) mapping to known words, falling back to spelling out 
    unknown words letter-by-letter.
    """
    # Simple tokenization: lowercase and extract words
    # To support "thank you", we might need a slightly more complex tokenizer, 
    # but for this MVP we'll do simple word replacement with a greedy match approach.
    
    # Normalize text
    clean_text = text.lower().strip()
    # Remove punctuation
    clean_text = re.sub(r'[^\w\s]', '', clean_text)
    
    sequence: List[SignSequenceItem] = []
    
    if not clean_text:
        return sequence

    # Greedy match for multi-word known phrases like "thank you"
    # We sort known words by length (number of words) descending to match phrases first
    sorted_known = sorted(list(KNOWN_WORDS), key=lambda x: len(x.split()), reverse=True)
    
    remaining_text = clean_text
    
    while remaining_text:
        remaining_text = remaining_text.strip()
        if not remaining_text:
            break
            
        matched = False
        for known_word in sorted_known:
            if remaining_text.startswith(known_word):
                # Ensure it's a full word match (next char is space or end of string)
                if len(remaining_text) == len(known_word) or remaining_text[len(known_word)].isspace():
                    sequence.append(SignSequenceItem(
                        type="word",
                        text=known_word,
                        url=f"/assets/words/{known_word.replace(' ', '_')}.svg"
                    ))
                    remaining_text = remaining_text[len(known_word):]
                    matched = True
                    break
        
        if not matched:
            # Take the first word, spell it out, then continue
            first_word = remaining_text.split()[0]
            for char in first_word:
                if char.isalpha():
                    sequence.append(SignSequenceItem(
                        type="letter",
                        text=char.upper(),
                        url=f"/assets/letters/{char.upper()}.svg"
                    ))
            
            remaining_text = remaining_text[len(first_word):]

    return sequence
