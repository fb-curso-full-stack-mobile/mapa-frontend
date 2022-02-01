import { useEffect, useState } from "react";
import Input from "./Input";
import SearchBox from "./SearchBox";

import "./POIBox.css";
import { useForm } from "react-hook-form";
import Button from "./Button";

type POIBoxProps = {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  onPoiSaved: () => void;
};

export default function POIBox({ onPlaceSelected, onPoiSaved }: POIBoxProps) {
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox>();
  const { register, handleSubmit, setValue } = useForm();

  const handleOnPlacesChanged = () => {
    const searchBoxPlaces = searchBox!.getPlaces();
    const place = searchBoxPlaces![0];
    if (place.geometry && place.geometry.location) {
      onPlaceSelected(place);
      setValue("address", place.formatted_address || "");
      setValue("lat", place.geometry.location.lat());
      setValue("lng", place.geometry.location.lng());
    }
  };

  const save = (data: any) => {
    console.log(data);
    fetch("http://localhost:3001/v1/poi", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }).then(async (response) => {
      const json = await response.json();
      if (response.ok) {
        setValue("address", "");
        setValue("name", "");
        setValue("description", "");
        onPoiSaved();
      } else {
        console.log("Erro ", json.message);
      }
    });
  };

  useEffect(() => {
    register("lat");
    register("lng");
  }, [register]);

  return (
    <form onSubmit={handleSubmit(save)}>
      <SearchBox
        onLoad={setSearchBox}
        onPlacesChanged={handleOnPlacesChanged}
        register={register}
        name="address"
      />
      <Input placeholder="Nome" register={register} name="name" />
      <Input placeholder="Descrição" register={register} name="description" />
      <Button type="submit">Salvar</Button>
    </form>
  );
}
