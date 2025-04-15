import { useState } from "react";
import { CarEntry, CarResponse } from "../types";
import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import CarDialogContent from "./CarDialogContent";
import { updataCar } from "../api/carapi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit"
import { Tooltip } from "@mui/material";

type FormProps = {
  cardata: CarResponse
}

function EditCar({cardata} : FormProps) {
  const [open, setOpen] = useState(false);
  const [car, setCar] = useState<Car>({
    brand: '',
    model: '',
    color: '',
    registrationNumber: '',
    modelYear: 0,
    price: 0
  });
  const queryClient = useQueryClient();
  const {mutate} = useMutation(updataCar, {
    onSuccess: () => {
      queryClient.invalidateQueries(['cars']);
    },
    onError: (err) => {
      console.log(err);
    }
  });

  const handleClickOpen = () => {
    setCar({
      brand: cardata.brand,
      model: cardata.model,
      color: cardata.color,
      registrationNumber: cardata.registrationNumber,
      modelYear: cardata.modelYear,
      price: cardata.price
    });
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleSave = () => {
    const url = cardata._links.self.href;
    const carEntry: CarEntry = {car, url}
    mutate(carEntry);
    setCar({
      brand: '',
      model: '',
      color: '',
      registrationNumber: '',
      modelYear: 0,
      price: 0
    });
    setOpen(false);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCar({...car, [event.target.name]: event.target.value});
  }

  return (
    <>
      <Tooltip title="Edit car">
        <IconButton aria-label="edit" size="small"
          onClick={handleClickOpen}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>자동차 수정</DialogTitle>
        <CarDialogContent car={car} handleChange={handleChange} />
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditCar;