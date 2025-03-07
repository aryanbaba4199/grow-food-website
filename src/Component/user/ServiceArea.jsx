import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { posterFunction, vendorApi } from "@/Api";
import Swal from "sweetalert2";

const ServiceArea = ({ district, setOpen, fetchArea }) => {
  const [area, setArea] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { district, area };
    try {
      await posterFunction(vendorApi.distributionArea, formData);


      Swal.fire({
        title: "Area added successfully",
        icon: "success",
      });
      await fetchArea(district)
      setOpen(false);
    } catch (e) {
      console.error("Failed to add area:", e);
      Swal.fire({
        title: "Failed to add area",
        icon: "error",
      });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: 400,
        height: 250,
        margin: "auto",
        mt: 3,
      }}
    >
      {/* District Field (Disabled) */}
      <div className="w-full justify-center flex flex-col gap-4 px-8 py-8">
        <TextField
          label="District"
          value={district}
          disabled
          fullWidth
          variant="outlined"
        />

        {/* Area Field (User Input) */}
        <TextField
          label="Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          required
          fullWidth
          variant="outlined"
        />

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </div>
    </Box>
  );
};

export default ServiceArea;
