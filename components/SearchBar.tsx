import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'
import { Product, RootStackParamList } from "@/types/navigation";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useSearchBarPressed } from "./searchBarPressed";
import { apiUrl } from "@/assets/lib";
import { launchImageLibrary } from 'react-native-image-picker';
import { imageUpload } from "@/assets/imageupload";
import { FontAwesome } from "@expo/vector-icons";

const SearchBar:React.FC = () => {
    const[allProducts, setAllProducts] = useState<Product[]>([]);
    const searchPressed = useSearchBarPressed();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [imageUri, setImageUri] = useState<any>(null);
    const [isUploading, setisUploading] = useState(false);
    const [imageData, setimageData] = useState([]);
    const[searchItem, setSearchItem] = useState('');

    const getImageInfo = (uri:string)=>{
        setisUploading(true)
        fetch(apiUrl+"/image-text",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({uri:uri})
        })
        .then((res)=>res.json())
        .then((result)=>{
          
            console.log(result?.data?.result?.tags);
            setimageData(result?.data?.result?.tags)
            const imgdt = result?.data?.result?.tags
            handleSearch(imgdt[0]?.tag?.en)
            let allpro: any[] = []
            if(imgdt[0]?.tag?.en.includes(" ")){
                imgdt[0]?.tag?.en.split(" ").map((item)=>{
                console.log('item');
                
                const filteredArray: Product[] = allProducts.filter((prod: Product) => prod.title.toLowerCase().includes(item.toLowerCase()) );

                allpro=[...allpro,...filteredArray]
            })}else{
                console.log(imgdt[0]?.tag?.en);
                
                allpro = allProducts.filter((prod: Product) => prod.title.toLowerCase().includes(imgdt[0]?.tag?.en.toLowerCase()) );
            }
            setisUploading(false)
            
            // navigation.navigate('searchResults', allpro)
        })
        .catch((err)=>{
            setisUploading(false)
            console.log(err);
        }
        )
    }

  

    const pickImage = () => {
        setImageUri(null)
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
              
             
              const liveLink:any = await imageUpload(uri)
              console.log(uri,liveLink);
              setImageUri(liveLink);
              getImageInfo(liveLink)
              setisUploading(false)
            }
          }
        );
    };
    

    useEffect(() => {
        fetch(apiUrl+"/get-item",{
            method:"POST",
            headers:{
            "Content-Type":"application/json"
            },
            body: JSON.stringify({table:"products", query:{status:"Approved"}})
        })
        .then(response => response.json())
        .then(data => {
            
        const productData:Product[] = data?.result.map((product:Product) => {
            return(
                {   image: product.image,
                    title: product.title,
                    price: product.price,
                    description:product.description
                }
            )})
        setAllProducts(productData);
        })
    },[]);

    
    const handleSearch = (input:string) => {
        setSearchItem(input);
    }
   const pressSearch = () => {
    searchPressed.setPressed();
   }
    const filteredArray: Product[] = allProducts.filter((prod: Product) => prod.title.toLowerCase().includes(searchItem.toLowerCase()) );
    return(<View>
        <View className="border-b-4 mt-4 flex  border-[#7F00FF] flex-row p-4   z-50 justify-between self-center rounded-xl   bg-white w-[95vw]">
            <TextInput value={searchItem} onChangeText={handleSearch}  className="font-bold w-[70%] text-lg text-black" placeholder="Search any item"/>

            <View className="flex flex-row space-x-2">
                {!isUploading&&<Pressable onPress={() => pickImage()}>
                    {!imageUri&&<Icon name="image" color='#7F00FF'  size={25}/>}
                    {imageUri&&<Image source={{uri:imageUri}} className="w-9 h-9" resizeMode="cover" />}
                </Pressable>}
                {isUploading&&<FontAwesome name="refresh" color='#7F00FF'  size={25}/>}
                <Pressable onPress={() => navigation.navigate('searchResults', filteredArray)}><Icon name="search" color='#7F00FF'  size={25}/></Pressable>
            </View>
        </View>
        
       { imageData&&<ScrollView className="h-[400px] bg-gray-100 p-4">
            <Text className="my-2">{isUploading?"Searching...":'Related Keyword'}</Text>
            {imageData&&imageData.map((item,index)=>{
                return item?.confidence>20 && <TouchableOpacity className='p-3 bg-gray-200 rounded' key={index} onPress={()=>{
                    handleSearch(item?.tag?.en)
                    
                }}>
                <Text>{item?.tag?.en}</Text>
            </TouchableOpacity>
            })}
        </ScrollView>}
        </View>
    )
}
export default SearchBar;