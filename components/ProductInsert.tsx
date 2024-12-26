import { AuthProvider } from '@/app/_layout';
import { imageUpload } from '@/assets/imageupload';
import { apiUrl } from '@/assets/lib';
import { FontAwesome } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, ToastAndroid, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

interface Product{
    image: String;
    title: String;
    price: Number;
    description:String;
}
interface TailwindPros{
    className:String
}

const ProductInsertScreen = () => {
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setcategory] = useState('');
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<any>([]); // State to store product list
  const {data} = useContext<any>(AuthProvider)
  const [isLoading, setisLoading] = useState(false);
    const [isUploading, setisUploading] = useState(false);

      const pickImage = () => {
          
          setisUploading(true)
          launchImageLibrary(
            {
              mediaType: 'photo',
            },
            async (response) => {
  
              if (response.didCancel) {
                console.log('User cancelled image picker');
                setisUploading(false)
              } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                setisUploading(false)
              } else {
                const uri = response.assets[0].uri;
                const liveurl = await imageUpload(uri)
                setImage(liveurl)
                setisUploading(false)
              }
            }
          );
      };

  const handleSubmit = () => {
    if (!image || !title || !price || !description || category) {
      Alert.alert('Please fill out all fields.');
      return;
    }
    setisLoading(true)
    fetch(apiUrl+"/insert-item",{
        method:"POST",
        headers:{
        "Content-Type":"application/json"
        },
        body: JSON.stringify({table:"products", data:{image,title,price,description,user:data,userId:data?._id,status:"Pending", category}})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        setisLoading(false)
        return ToastAndroid.show(data?.message,ToastAndroid.SHORT)
    })

    // Add product to the list
    const newProduct = { image, title, price, description };
    setProducts([newProduct, ...products]);

    // Clear the form
    setImage('');
    setTitle('');
    setPrice('');
    setcategory('')
    setDescription('');
  };

  const getData = ()=>{
    fetch(apiUrl+"/get-item",{
        method:"POST",
        headers:{
        "Content-Type":"application/json"
        },
        body: JSON.stringify(data?.role!=='Admin'?{table:"products", query:{userId:data?._id}}:{table:"products", query:{}})
    })
    .then(response => response.json())
    .then(data => {
        
    
    setProducts(data?.result);
    })
  }

  const updateData = (id:any,status:String)=>{
    fetch(apiUrl+"/update-item",{
        method:"POST",
        headers:{
        "Content-Type":"application/json"
        },
        body: JSON.stringify({table:"products", data:{status:status},id:id})
    })
    .then(response => response.json())
    .then(data => {
        ToastAndroid.show(data?.message,ToastAndroid.SHORT)
        getData()
    })
  }
  const deleteData = (id:any)=>{
    fetch(apiUrl+"/delete-item",{
        method:"POST",
        headers:{
        "Content-Type":"application/json"
        },
        body: JSON.stringify({table:"products", query:{id:id}})
    })
    .then(response => response.json())
    .then(data => {
        ToastAndroid.show(data?.message,ToastAndroid.SHORT)
        getData()
    })
  }

    useEffect(() => {
        getData()
    },[])

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold text-center mb-6">Add New Product</Text>

      {/* Image Input */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Image</Text>
        {/* <TextInput
          value={image}
          onChangeText={setImage}
          className="border border-gray-300 rounded-md px-3 py-2 text-base"
          placeholder="Enter image URL"
        /> */}
        <View className="flex flex-row justify-between">
            <TouchableOpacity onPress={pickImage} className="border border-gray-300 justify-center items-center flex rounded-md px-3 py-2 w-1/2 h-[80px]" style={{borderStyle:'dashed'}}
            >
                {<Text>{isUploading?"Uploading...":'Upload Image'}</Text>}
            </TouchableOpacity>
            <View>
                {!image&&<FontAwesome name='image' size={80} />}
                {image&&<Image source={{uri:image}} className="h-20 w-20" resizeMode='cover' />}
            </View>
        </View>
      </View>

      {/* Title Input */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          className="border border-gray-300 rounded-md px-3 py-2 text-base"
          placeholder="Enter product title"
        />
      </View>

      {/* Price Input */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Price</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          className="border border-gray-300 rounded-md px-3 py-2 text-base"
          placeholder="Enter product price"
          keyboardType="numeric"
        />
      </View>
      {/* category Input */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Category</Text>
        <TextInput
          value={category}
          onChangeText={setcategory}
          className="border border-gray-300 rounded-md px-3 py-2 text-base"
          placeholder="Enter product category"
          keyboardType="default"
        />
      </View>

      {/* Description Input */}
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1">Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          
          className="border border-gray-300 rounded-md px-3 py-2 text-base"
          placeholder="Enter product description"
          multiline
          textAlignVertical="top"
          numberOfLines={4}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        disabled={isLoading}
        onPress={handleSubmit}
        className="bg-blue-500 rounded-md py-3 mt-4"
      >
        <Text className="text-center text-white font-bold">{isLoading?"Loading":"Submit Product"}</Text>
      </TouchableOpacity>

      {/* Product List */}
      <Text className="text-lg font-semibold mt-6 mb-3">Product List</Text>
      {products.length === 0 ? (
        <Text className="text-gray-500 text-center">No products added yet.</Text>
      ) : 
      products&&products?.map((item:Object,index:Number)=>{
            return <View key={index} className="border border-gray-300 flex flex-row space-x-2 rounded-md p-4 mb-3">
            <View>
                <Image className="h-16 w-16" source={{uri:item?.image}} />
                {data?.role==='Admin'&&<>
                {item?.status!=='Approved'&&<TouchableOpacity onPress={()=>updateData(item?._id,"Approved")} className="bg-green-600 rounded mt-1 p-1">
                    <Text className="text-xs text-center text-white">Approve</Text>
                </TouchableOpacity>}
                {item?.status==='Approved'&&<TouchableOpacity onPress={()=>updateData(item?._id,"Pending")} className="bg-red-600 rounded mt-1 p-1">
                    <Text className="text-xs text-center text-white">Reject</Text>
                </TouchableOpacity>}

                <TouchableOpacity onPress={()=>deleteData(item?._id)} className="bg-red-600 rounded mt-1 p-1">
                    <Text className="text-xs text-center text-white">Delete</Text>
                </TouchableOpacity>
                </>}
            </View>
            <View className="w-full">
              <Text className="font-bold text-lg w-[83%]">{item?.title}</Text>
              <Text className="text-gray-700">Price: ${item?.price}</Text>
              <Text className="text-gray-500 w-[83%]">{item?.description.substr(0,100)}...</Text>
              <Text className={`${item?.status==='Approved'?"text-green-600":"text-red-500"} text-xs`}>{item?.status?item?.status:"Pending"}</Text>
            </View>
            
          </View>
        })
        
      }
    </View>
  );
};

export default ProductInsertScreen;
