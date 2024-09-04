import { useState } from "react";
import useCityResturants from "../hooks/useCityResturants";
import { useParams, useSearchParams } from "react-router-dom";

const MapSelectedCities = () => {
    const [city, setCity] = useState<string | null>(null);
    const [searchParams] = useSearchParams();
    const cityParamSearch = searchParams.get("city");
    const { data } = useCityResturants(cityParamSearch);

    console.log("data: ", data);


    return (
        <div>


        </div>
    )
}

export default MapSelectedCities