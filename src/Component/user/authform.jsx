import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  TextField,
  Button,
  Autocomplete,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  useJsApiLoader,
  Autocomplete as GoogleSuggestion,
} from "@react-google-maps/api";
import debounce from "lodash.debounce";

const libraries = ["places"];

/**
 * @typedef {Object} AuthFormProps
 * @property {string} authType
 * @property {Object} formData
 * @property {Function} setFormData
 * @property {Function} handleAuthSwitch
 * @property {Function} handleSubmit
 * @property {boolean} open
 * @property {boolean} resetOpen
 * @property {string} otp
 * @property {Function} setOtp
 * @property {string} newPassword
 * @property {Function} setNewPassword
 * @property {string} confirmPassword
 * @property {Function} setConfirmPassword
 * @property {Function} handleVerifyOtp
 * @property {Function} handleResetPassword
 */

/**
 * @param {AuthFormProps} props
 */
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
  const autocompleteRef = useRef(null);
  const shouldLoadMap = authType === "SignUp";
  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [addressInput, setAddressInput] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAi2MQyWnPyrSAY_jny04NPMKWoXZH5M1c",
    libraries,
  });

  // Debounced function to fetch location suggestions
  const fetchSuggestions = useCallback(
    debounce(async (input) => {
      if (!input || !input.includes(" ")) return;
      setIsLoadingSuggestions(true);
      try {
        const response = await fetch(
          `https://education-1064837086369.asia-south1.run.app/college/suggestLocation?input=${encodeURIComponent(
            input
          )}&type=establishment`
        );
        const data = await response.json();
        setSuggestions(data.predictions || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 500),
    []
  );

  // Forward geocoding with OpenCage
  const forwardGeocode = async (inputAddress) => {
    try {
      const API_KEY = "97b4515e61ee4bf4bf8822d16b2cc839"; // Replace with your OpenCage API Key
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          inputAddress
        )}&key=${API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setFormData((prev) => ({
          ...prev,
          shopAddress: {
            formattedAddress: inputAddress,
            lat,
            lng,
          },
        }));
        return true;
      } else {
        setFormData((prev) => ({
          ...prev,
          shopAddress: {
            formattedAddress: inputAddress,
            lat: 0,
            lng: 0,
          },
        }));
        alert("Invalid address. Please provide a more specific address.");
        return false;
      }
    } catch (error) {
      console.error("Error during forward geocoding:", error);
      setFormData((prev) => ({
        ...prev,
        shopAddress: {
          formattedAddress: inputAddress,
          lat: 0,
          lng: 0,
        },
      }));
      alert("Error validating address. Please try again.");
      return false;
    }
  };

  // Handle address input change
  const handleAddressChange = (event, newInputValue) => {
    setAddressInput(newInputValue);
    if (newInputValue.includes(" ")) {
      fetchSuggestions(newInputValue);
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = async (event, newValue) => {
    if (newValue) {
      setAddressInput(newValue.description);
      await forwardGeocode(newValue.description);
      setSuggestions([]);
    }
  };

  // Handle Google Places selection
  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place?.geometry?.location) {
        setFormData((prev) => ({
          ...prev,
          shopAddress: {
            formattedAddress: place.formatted_address,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
        }));
        setAddressInput(place.formatted_address);
        autocompleteRef.current.value = "";
      }
    }
  };

  // Configure autocomplete options for local places
  const autocompleteOptions = {
    types: ["geocode"],
    componentRestrictions: { country: "in" },
    fields: ["formatted_address", "geometry.location"],
  };

  if (shouldLoadMap && !isLoaded) {
    return <div className="text-center text-gray-500">Loading map...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <Typography
        variant="h5"
        align="center"
        className="mb-6 text-green-600 font-bold"
      >
        The Grow Food
      </Typography>

      {!open ? (
        <>
          {authType === "SignUp" && (
            <>
              <TextField
                label="Shop Name"
                fullWidth
                margin="normal"
                value={formData.shopName}
                onChange={(e) =>
                  setFormData({ ...formData, shopName: e.target.value })
                }
              />
              <TextField
                label="Contact Person Name"
                fullWidth
                margin="normal"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <TextField
                label="Mobile ( +91 ) "
                fullWidth
                margin="normal"
                placeholder="Enter 10 digit mobile number"
                type="tel"
                value={formData.mobile}
                inputProps={{
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  maxLength: 10,
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    setFormData({ ...formData, mobile: val });
                  }
                }}
              />
              {isLoaded && (
                <>
                  <Autocomplete
                    freeSolo
                    options={suggestions}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.description
                    }
                    onInputChange={handleAddressChange}
                    onChange={handleSuggestionSelect}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Shop Address"
                        fullWidth
                        margin="normal"
                        placeholder="Start typing an area (e.g., Saraiya)"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isLoadingSuggestions ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                  {/* <GoogleSuggestion
                    onLoad={(autocomplete) => {
                      autocompleteRef.current = autocomplete;
                      autocomplete.setOptions(autocompleteOptions);
                      if (
                        formData.shopAddress?.lat &&
                        formData.shopAddress?.lng
                      ) {
                        autocomplete.setBounds(
                          new window.google.maps.Circle({
                            center: {
                              lat: formData.shopAddress.lat,
                              lng: formData.shopAddress.lng,
                            },
                          }).getBounds()
                        );
                      }
                    }}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <TextField
                      label="Search with Google Maps"
                      fullWidth
                      margin="normal"
                      placeholder="Alternative: Search via Google Maps"
                    />
                  </GoogleSuggestion> */}
                </>
              )}
              <Autocomplete
                options={["Restaurant", "Vendor"]}
                value={formData.userType}
                onChange={(e, newValue) =>
                  setFormData({ ...formData, userType: newValue })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="User Type"
                    fullWidth
                    margin="normal"
                  />
                )}
              />
              {formData.userType === "Vendor" && (
                <>
                  <TextField
                    label="State"
                    fullWidth
                    margin="normal"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                  <TextField
                    label="City"
                    fullWidth
                    margin="normal"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                  <TextField
                    label="Radius (KM)"
                    fullWidth
                    margin="normal"
                    type="number"
                    value={formData.radius}
                    onChange={(e) =>
                      setFormData({ ...formData, radius: e.target.value })
                    }
                  />
                </>
              )}
              <TextField
                label="GST (Optional)"
                fullWidth
                margin="normal"
                value={formData.gst}
                onChange={(e) =>
                  setFormData({ ...formData, gst: e.target.value })
                }
              />
            </>
          )}
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            type="email"
          />
          {(authType === "SignUp" || authType === "SignIn") && (
            <TextField
              label="Password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              type="password"
            />
          )}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleAuthSwitch}
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              {authType === "SignIn" ? "Create Account" : "Sign In"}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              {authType === "SignIn"
                ? "Sign In"
                : authType === "SignUp"
                ? "Create Account"
                : "Send Email"}
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <Typography
            variant="subtitle1"
            className="my-4 text-gray-700 font-semibold"
          >
            Enter OTP (Check your email)
          </Typography>
          <TextField
            type="number"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full mb-4"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleVerifyOtp}
            className="bg-green-600 hover:bg-green-700"
          >
            Validate OTP
          </Button>
        </div>
      )}
      {resetOpen && (
        <div className="flex flex-col items-center mt-6">
          <TextField
            required
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="w-full mb-4"
          />
          <TextField
            required
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            className="w-full mb-4"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleResetPassword}
            className="bg-green-600 hover:bg-green-700"
          >
            Reset Password
          </Button>
        </div>
      )}
    </div>
  );
};

export default Authform;