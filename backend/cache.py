import time

CACHE = {}
CACHE_TTL = 30  # seconds

def get_from_cache(key):
    item = CACHE.get(key)
    if not item:
        return None

    data, timestamp = item
    if time.time() - timestamp > CACHE_TTL:
        del CACHE[key]
        return None

    return data

def save_to_cache(key, data):
    CACHE[key] = (data, time.time())
