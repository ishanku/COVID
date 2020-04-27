from config import googlekey
import requests

class googleapi():
    def getLatLon(Address):
        loc =[]
        #Send request and receive json data by address
        target_url = ('https://maps.googleapis.com/maps/api/geocode/json?''address={0}&key={1}').format(Address, googlekey)
        geo_data = requests.get(target_url).json()
        if geo_data["status"] == 'OK':
            #lat = geo_data["results"][0]["geometry"]["location"]["lat"]
            #lng = geo_data["results"][0]["geometry"]["location"]["lng"]
            loc.append(geo_data["results"][0]["geometry"]["location"]["lat"])
            loc.append(geo_data["results"][0]["geometry"]["location"]["lng"])
        else:
            loc.append("NaN")
            loc.append("NaN")
        return loc