import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, ScrollView, View, Text, Pressable, TouchableOpacity, RefreshControl } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useRef, useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList, Product } from '../types/navigation'; 
import { apiUrl } from '@/assets/lib';


export default function TabTwoScreen() {
  const[allProducts, setAllProducts] = useState<Product[]>([]);
  const[currentPage, setCurrentPage] = useState<number>(1);
  const [refreshing, setRefreshing] = useState(false);
  
    const onRefresh = ()=>{
      setRefreshing(true);
      setAllProducts([])
      setTimeout(() => {
        getPreduct()
        setRefreshing(false);
      }, 2000); // Simulated network request
    }
  const getPreduct = ()=>{
      fetch(apiUrl+"/get-item",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({table:"products", query:{status:'Approved'}})
      })
      .then(result => result.json())
      .then(data => {
       
        
        const productData: Product[] = data?.result.map((singleProd:any) => {
          return({
          image:singleProd.image,
          title:singleProd.title,
          price:singleProd.price,
          category:singleProd.category,
          description:singleProd.description
          })
        })
        setAllProducts(productData);
        
      })
      .catch((error) => console.log('error fetching data', error));
    }
  const itemsPerPage = 5;
  useEffect(() => {
    // fetch('https://fakestoreapi.com/products?limit=10')
    // .then(result => result.json())
    // .then(data => {
    //   const allProdsData: Product[] = data.map((prod:Product) => {
    //     return({
    //         image: prod.image,
    //         title: prod.title,
    //         price: prod.price,
    //         category: prod.category,
    //         description:prod.description
    //       })
    //   })
    //   setAllProducts(allProdsData);
    // })
    getPreduct()
  },[])
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = (startIndex + itemsPerPage);
  const paginatedProducts = allProducts.slice(startIndex, endIndex);
  const handleNextPage = () => {
    if(endIndex < allProducts.length){
      setCurrentPage(currentPage + 1);
      scrollToTop();
    }
    
  }
  const handlePrevPage = () => {
    if(currentPage > 1){
      setCurrentPage(currentPage - 1);
      scrollToTop();
    }
    
  }

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({y:0, animated:true});
  }
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  

  return (
    <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Text className="text-3xl font-light text-fuchsia-600  mt-5  text-center p-4" >
        Browse through everything
      </Text>
      <View>

      </View>
      {paginatedProducts.map( (product:Product, index:number) => {
        return(
                <View key={index} className="flex flex-col h-max mb-4 self-center w-3/4  rounded-xl space-y-4 p-2  mt-5 mx-2" style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    shadowColor: '#7F00FF',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 5,
                }} >
                  <TouchableOpacity  onPress={() => navigation.navigate('productDetails', product)}>
                    <Image
                        source={{ uri: product.image }}
                        className="w-40 h-40 self-center   rounded-xl"
                        resizeMode="contain"
                    />
                    <View className="flex  rounded-xl py-0 self-center    flex-col space-y-1">
                        <Text className="text-md w-40 h-max text-center font-bold text-black">{product.title}</Text>
                        <Text className="w-40 h-max text-md  font-extrabold text-center text-gray-700">{`$${product.price}`}</Text>
                    </View>
                    </TouchableOpacity>
                </View>
          
        )
      })}
      <View className="flex mb-4 flex-row justify-between p-5">
        {currentPage > 1 && 
        <Pressable className={`  border-2 border-gray-300 p-2 rounded-xl  outline `}  onPress={handlePrevPage}><Text className="text-md font-medium text-[#7F00FF]">Previous</Text></Pressable>
        }
        {endIndex < allProducts.length &&
        <Pressable className=" border-2 border-gray-300 p-2 rounded-xl" onPress={handleNextPage}><Text className="text-md font-medium  text-[#7F00FF]">{`Next`} </Text></Pressable>
        }
        </View>
    </ScrollView>
  );
}

