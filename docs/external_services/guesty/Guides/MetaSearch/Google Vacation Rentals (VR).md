# Google Vacation Rentals (VR)

Integrate Google VR with your Booking Engine API.

Follow the guidelines below to effectively integrate Google with your website or app powered by the Booking Engine API.

1. Ensure you have an active Booking Engine API instance via the Guesty platform. Please verify your configuration for the Booking Engine API.
2. Ensure you are using the [Reservation quote flow](https://booking-api-docs.guesty.com/reference/createreservationquote) endpoints.
   1. Using the *Reservations V1* flow is **unsupported** and may cause issues, such as invalid price accuracy.
3. To build your integration, go to the [Upsert metasearch config](https://booking-api-docs.guesty.com/reference/upsertmetasearchconfig) endpoint. You will need to create a URL that meets Google's requirements. You can find their official instructions and examples [here](https://developers.google.com/hotels/hotel-prices/dev-guide/pos-urls#building-rules).
   1. Note the value for the `pointofsale` path parameter must be `google`.

## Supported Variables

Only the following Google variables are supported by Guesty. Any other variables will cause the integration to fail.

```
(PARTNER-HOTEL-ID)
(NUM-GUESTS)
(CHECKINYEAR)
(CHECKINMONTH)
(CHECKINDAY)
(CHECKOUTYEAR)
(CHECKOUTMONTH)
(CHECKOUTDAY)
```

**Request Example**

```curl
curl --request PUT \
     --url https://booking.guesty.com/api/metasearch/pointofsale/google/config \
     --header 'accept: application/json; charset=utf-8' \
     --header 'content-type: application/json' \
     --data '
{
  "url": "https://www.getaway.com/properties/(PARTNER-HOTEL-ID)?minOccupancy=(NUM-GUESTS)&amp;checkIn=(CHECKINYEAR)-(CHECKINMONTH)-(CHECKINDAY)&amp;checkOut=(CHECKOUTYEAR)-(CHECKOUTMONTH)-(CHECKOUTDAY)&amp;pointofsale=google"
}
'
```

```php
<?php
require_once('vendor/autoload.php');

$client = new \GuzzleHttp\Client();

$response = $client->request('PUT', 'https://booking.guesty.com/api/metasearch/pointofsale/google/config', [
  'body' => '{"url":"https://getaway.com/properties/(PARTNER-HOTEL-ID)?minOccupancy=(NUM-GUESTS)&amp;checkIn=(CHECKINYEAR)-(CHECKINMONTH)-(CHECKINDAY)&amp;checkOut=(CHECKOUTYEAR)-(CHECKOUTMONTH)-(CHECKOUTDAY)&amp;pointofsale=google"}',
  'headers' => [
    'accept' => 'application/json; charset=utf-8',
    'content-type' => 'application/json',
  ],
]);

echo $response->getBody();
```

```python
import requests

url = "https://booking.guesty.com/api/metasearch/pointofsale/google/config"

payload = {"url": "https://www.getaway.com/properties/(PARTNER-HOTEL-ID)?minOccupancy=(NUM-GUESTS)&amp;checkIn=(CHECKINYEAR)-(CHECKINMONTH)-(CHECKINDAY)&amp;checkOut=(CHECKOUTYEAR)-(CHECKOUTMONTH)-(CHECKOUTDAY)&amp;pointofsale=google"}
headers = {
    "accept": "application/json; charset=utf-8",
    "content-type": "application/json"
}

response = requests.put(url, json=payload, headers=headers)

print(response.text)
```

> 🚧 Body URL Parameters
>
> Make sure the URL in the body contains Google's parameters, not Guesty's, else the integration will fail.

4. Go to the Guesty platform and click on **Integration**, then **Distribution**. Finally, click the **Google Integration** tile and continue with the integration flow.