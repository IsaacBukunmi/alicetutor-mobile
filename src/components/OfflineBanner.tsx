import { Colors } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function OfflineBanner() {
    return(
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.amberSoft,
            paddingHorizontal: 16,
            paddingVertical: 8,
            gap: 8,
          }}>
            <Ionicons name="cloud-offline-outline" size={16} color={Colors.amberText} />
            <Text style={{
              fontFamily: 'PlusJakartaSans-SemiBold',
              fontSize: 12.5,
              color: Colors.amberText,
            }}>
              You're offline — showing cached content
            </Text>
        </View>
    )
}