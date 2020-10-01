# Description

- upload the image on two providers and return the data from the first response ( faster response ).
- we can easily add more providers to upload images
- deploying back end we can decide upload strategy (provider selection)
   - upload on multibe providers
   - upload on one provider
   - upload on given provider
   - adding another provier

#### How to run the project

- create `.env` file in the root directory and add your

 ```
 CLOUDINARY_CLOUD_NAME=xxxxxxxxxxx
 CLOUDINARY_API_KEY=xxxxxxxxxxxxxxxxx
 CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxx
```

- create a folder named `images` so that we store the images locally



#### Endpoints

**upload image**
----
    return json data a bout the uploaded image

* **URL**

  /upload

* **Method:**
  
   `POST`
  
* **Success Response:**
  
    The response should be an object with keys (id, file name, image url or file path )

  * **Code:** 200 <br />
    **Content:** `{ id : 12,name : 'naturre.png',url:'image url or file path' }`
 
