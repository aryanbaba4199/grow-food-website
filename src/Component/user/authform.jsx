import React, { useEffect, useState } from "react";
import { TextField, Button, Autocomplete, Container, Dialog } from "@mui/material";
import { getterFunction, vendorApi } from "@/Api";
import { getUserGeoLocation } from "@/Context/functions";
import ServiceArea from "./ServiceArea";

const Authform = ({
  authType,
  formData,
  setFormData,
  handleAuthSwitch,
  handleSubmit,
  open,
  resetOpen,
  otp,
  setOtp,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleVerifyOtp,
  handleResetPassword,
}) => {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [distributionAreas, setDistributionAreas] = useState([{district : null, area : null}]);
  const [loader, setLoader] = useState(false);
  const [disOpen, setDisOpen] = useState(false);

  useEffect(() => {
    if (authType === "SignUp") {
      getLocation();
      fetchStates();
    }
  }, [authType]);

  const fetchStates = async () => {
    try {
      const res = await getterFunction(vendorApi.getState);
      setStates(res);
    } catch (e) {
      console.error("Failed to fetch states:", e);
    }
  }

  const getLocation = async () => {
    const location = await getUserGeoLocation();
    if (location.response) {
      setFormData((prev) => ({ ...prev, shopAddress: location.data }));
    }
  };

  const fetchCities = async (state) => {
    try {
      const res = await getterFunction(`${vendorApi.getDistricts}/${state}`);
      setCities(res);
    } catch (e) {
      console.error("Failed to fetch cities:", e);
    }
  };

  const fetchDistributionAreas = async (city) => {
    console.log('city is', city)
    try {
      const res = await getterFunction(`${vendorApi.distributionArea}/${city}`);
      setDistributionAreas(res);
    } catch (e) {
      console.error("Failed to fetch distribution areas:", e);
    }
  };
  console.log("Distribution", distributionAreas); 

  

  return (
    <Container maxWidth="sm">
      <div className="container items-center">
        <div className="flex justify-center items-center text-2xl font-bold">
          <span className="text-[#15892e]">The Grow Food</span>
        </div>
        {!open ? (
          <>
            {authType === "SignUp" && (
              <>
                <TextField
                  label="Shop Name"
                  fullWidth
                  margin="normal"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                />
                <TextField
                  label="Contact Person Name"
                  fullWidth
                  margin="normal"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <TextField
                  label="Mobile"
                  fullWidth
                  margin="normal"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
                <TextField
                  label="Shop Address"
                  fullWidth
                  margin="normal"
                  value={formData.shopAddress}
                  onChange={(e) => setFormData({ ...formData, shopAddress: e.target.value })}
                />
                <Autocomplete
                  options={["Restaurant", "Vendor"]}
                  value={formData.userType}
                  onChange={(e, newValue) => setFormData({ ...formData, userType: newValue })}
                  renderInput={(params) => <TextField {...params} label="User Type" fullWidth margin="normal" />}
                />
                {formData.userType === "Vendor" && (
                  <>
                  <Autocomplete
                      options={states}
                      value={formData.state}
                      onChange={(e, newValue) => {
                        setFormData({ ...formData, state: newValue })
                        fetchCities(newValue)
                      }
                   
                      }
                      renderInput={(params) => <TextField {...params} label="State" fullWidth margin="normal" />}
                    />
                    <Autocomplete
                      options={cities.map((city)=>city.districts)}
                      value={formData.city}
                      onChange={(e, newValue) => {setFormData({ ...formData, city: newValue })
                      fetchDistributionAreas(newValue);
                    }}
                      renderInput={(params) => <TextField {...params} label="City" fullWidth margin="normal" />}
                    />
                    <div className="flex gap-8">
                    <Autocomplete
                    fullWidth
                      multiple
                      options={Array.isArray(distributionAreas) ? distributionAreas.map(item => item.area) : []}
                      value={formData.distributionAreas}
                      onChange={(e, newValue) => setFormData({ ...formData, distributionAreas: newValue })}
                      renderInput={(params) => <TextField {...params} label="Distribution Areas" fullWidth margin="normal" />}
                    />
                    <Button onClick={()=>setDisOpen(true)} className="h-12 mt-4" variant="outlined">Add</Button>
                    </div>
                  </>
                )}
                <TextField
                  label="GST Number"
                  fullWidth
                  margin="normal"
                  value={formData.gst}
                  onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                />
              </>
            )}
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              type="email"
            />
            {(authType === "SignUp" || authType === "SignIn") && (
              <TextField
                label="Password"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                type="password"
              />
            )}
            <div className="flex justify-between items-center">
              <Button variant="contained" color="inherit" onClick={handleAuthSwitch}>
                {authType === "SignIn" ? "Create Account" : "Sign In"}
              </Button>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                {authType === "SignIn" ? "Sign In" : authType === "SignUp" ? "Create Account" : "Send Email"}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center flex-col">
            <p className="font-semibold text-lg my-4">Please enter OTP (You can get this on your email)</p>
            <TextField
              type="number"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border-2 border-gray-300 rounded-md mb-4"
            />
            <Button variant="contained" color="primary" onClick={handleVerifyOtp}>
              Validate OTP
            </Button>
          </div>
        )}
        {resetOpen && (
          <div className="flex justify-center items-center flex-col mt-4">
            <TextField
              required
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full p-2 border-2 border-gray-300 rounded-md mb-4"
            />
            <TextField
              required
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full p-2 border-2 border-gray-300 rounded-md mb-4"
            />
            <Button variant="contained" color="primary" onClick={handleResetPassword}>
              Reset Password
            </Button>
          </div>
        )}
      </div>
      <Dialog open={disOpen} onClose={()=>setDisOpen(false)}>
        <ServiceArea district={formData.city} fetchArea={fetchDistributionAreas} setOpen={setDisOpen} />
      </Dialog>
    </Container>
  );
};

export default Authform;