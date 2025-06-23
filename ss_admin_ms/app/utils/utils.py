def serialize_offer(offer) -> dict:
    offer["_id"] = str(offer["_id"])
    return offer
