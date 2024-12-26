import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react"
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "@/types/navigation";
import { apiUrl } from "@/assets/lib";
type Product={
    image:string,
    title:string,
    price:string,
    description:string,
    category:string
}
const PopularProducts = () => {
    const[products, setProducts] = useState<Product[]>([]);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    useEffect(() => {
        fetch(apiUrl+"/get-item",{
            method:"POST",
            headers:{
            "Content-Type":"application/json"
            },
            body: JSON.stringify({table:"products", query:{ispopular:"true",status:'Approved'}})
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
        setProducts(productData);
        })
    },[])
return(
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        
        
            {products.map((product: Product, index:number) => {
                return(
                    <View key={index} className="flex flex-col h-max mb-4   rounded-xl space-y-4 p-2  mt-5 mx-2" style={{
                        backgroundColor: 'white', 
                        borderRadius: 12, 
                        shadowColor: '#7F00FF',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 5,
                    }}>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('productDetails', product)}>
                        <Image className="w-40 h-40 rounded-xl" resizeMode="contain" source={{uri:product.image}}/>
                        <View className="flex flex-col space-y-1">
                        <Text className="w-40 h-max text-md font-extrabold text-center text-black">{product.title}</Text>
                        <Text className="w-40 h-max text-sm  font-extrabold text-center text-gray-700">{`$${product.price}`}</Text>
                        </View>
                        </TouchableOpacity>
                    </View>
                )
            })}
    
    </ScrollView>
)

}

export default PopularProducts;

