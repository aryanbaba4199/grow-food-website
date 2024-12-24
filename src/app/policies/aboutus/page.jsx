import React from "react";
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";

const AboutUs = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#232f3e] text-white py-16">
        <Container>
          <Typography variant="h3" className="font-bold text-center">
            Welcome to <span className="text-green-400">The Grow Food</span>
          </Typography>
          <Typography variant="h5" className="mt-4 text-center">
            <i>Taste in Every Bite</i>
          </Typography>
        </Container>
      </div>

      {/* About Section */}
      <Container className="py-12">
        <Typography variant="h4" className="text-center font-bold mb-6 text-gray-800">
          About Us
        </Typography>
        <Typography className="text-gray-600 text-lg leading-relaxed text-center max-w-3xl mx-auto">
          At <strong>The Grow Food</strong>, we specialize in supplying high-quality raw materials to restaurants. 
          As a B2B company, our mission is to provide businesses with the finest ingredients, ensuring 
          that every dish prepared delivers exceptional taste and satisfaction. We’re dedicated to serving 
          restaurants with efficiency, reliability, and trust.
        </Typography>
      </Container>

      {/* Features Section */}
      <div className="bg-gray-200 py-12">
        <Container>
          <Typography variant="h4" className="text-center font-bold mb-6 text-gray-800">
            Why Choose Us
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Card className="shadow-md hover:shadow-lg transition">
                <CardContent className="text-center">
                  <Typography variant="h6" className="font-bold">
                    High-Quality Materials
                  </Typography>
                  <Typography className="text-gray-600 mt-2">
                    We ensure all raw materials meet stringent quality standards for excellent food preparation.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card className="shadow-md hover:shadow-lg transition">
                <CardContent className="text-center">
                  <Typography variant="h6" className="font-bold">
                    B2B Expertise
                  </Typography>
                  <Typography className="text-gray-600 mt-2">
                    Our focus on B2B operations allows us to tailor solutions that meet restaurant needs.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card className="shadow-md hover:shadow-lg transition">
                <CardContent className="text-center">
                  <Typography variant="h6" className="font-bold">
                    Reliable Supply Chain
                  </Typography>
                  <Typography className="text-gray-600 mt-2">
                    Consistent delivery and trustworthy partnerships make us a top choice for restaurants.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>

      {/* Mission Section */}
      <Container className="py-12">
        <Typography variant="h4" className="text-center font-bold mb-6 text-gray-800">
          Our Mission
        </Typography>
        <Typography className="text-gray-600 text-lg leading-relaxed text-center max-w-3xl mx-auto">
          Our mission is to revolutionize the way restaurants source their raw materials. By providing top-notch 
          quality and unparalleled service, we aim to empower culinary businesses to deliver unforgettable dining 
          experiences for their customers.
        </Typography>
      </Container>

      {/* Contact CTA */}
      <div className="bg-[#232f3e] text-white py-16">
        <Container>
          <Typography variant="h5" className="font-bold text-center">
            Ready to Partner with Us?
          </Typography>
          <Typography className="mt-4 text-center text-lg">
            Join hundreds of restaurants who trust <span className="text-yellow-400">The Grow Food </span> 
             for their raw material needs.
          </Typography>
        </Container>
      </div>
    </div>
  );
};

export default AboutUs;
