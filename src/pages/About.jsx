import React from "react"

import FoundingStory from "../assets/Images/FoundingStory.png"
import BannerImage1 from "../assets/Images/aboutus1.webp"
import BannerImage2 from "../assets/Images/aboutus2.webp"
import BannerImage3 from "../assets/Images/aboutus3.webp"
import Footer from "../components/Common/Footer"
import ReviewSlider from "../components/Common/ReviewSlider"
import ContactFormSection from "../components/core/AboutPage/ContactFormSection"
//import LearningGrid from "../components/core/AboutPage/LearningGrid"
import Quote from "../components/core/AboutPage/Quote"
import StatsComponenet from "../components/core/AboutPage/Stats"
import HighlightText from "../components/core/HomePage/HighlightText"

const About = () => {
  return (
    <div>
      <section className="bg-black">
        <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white">
          <header className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]">
            Driving Innovation in Online Education for a
            <HighlightText text={"Brighter Future"} />
            <p className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]">
                  CIVICA is on a mission to bring meaningful learning to the heart of every community. We focus on life skills, values, and practical knowledge — not just textbooks — using simple technology, volunteer-driven teaching, and a deep belief in the power of local change.            </p>
          </header>
          <div className="sm:h-[70px] lg:h-[150px]"></div>
          <div className="absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5">
            <img src={BannerImage1} alt="" />
            <img src={BannerImage2} alt="" />
            <img src={BannerImage3} alt="" />
          </div>
        </div>
      </section>

      <section className="border-b border-richblack-700">
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="h-[100px] "></div>
          <Quote />
        </div>
      </section>

      <section>
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500">
          <div className="flex flex-col items-center gap-10 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[50%] flex-col gap-10">
              <h1 className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Our Founding Story
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
               CIVICA was born from a simple yet powerful dream — to make meaningful learning accessible to every child, no matter where they live or what background they come from.
              </p>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                It started with a small team of changemakers — NGO volunteers, young developers, teachers, and community builders — who saw how children in rural and semi-urban areas were often left behind by traditional education. Many lacked basic digital tools, good teachers, or even a classroom.
              </p>

              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                So we asked ourselves: What if we could bring learning to them — learning that builds life skills, self-belief, and awareness, not just textbook knowledge?
              </p>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                That’s how CIVICA began — as a people-powered platform that brings non-academic, real-world learning to the heart of every community.
              </p>
            </div>

            <div>
              <img
                src={FoundingStory}
                alt=""
                className="shadow-[0_0_20px_0] shadow-[#FC6767]"
              />
            </div>
          </div>
          <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] ">
                Our Vision
              </h1>
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
               We envision a world where every child — regardless of where they live or what resources they have — gains access to meaningful, practical learning.
 <br></br> <br></br>CIVICA aims to revolutionize education not through marks, but through life-changing skills. From personal hygiene and safety to confidence-building and communication, our goal is to empower children with knowledge that truly matters in daily life.

 <br></br> <br></br>We believe that education should be human, local, and values-driven — not limited by academic exams or digital divides. That’s why our platform blends community involvement, local language learning, and offline-friendly tools to reach the last mile.


              </p>
            </div>
            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h1 className="bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] ">
              Our Mission
              </h1>
              
              <p className="text-base font-medium text-richblack-300 lg:w-[95%]">
                CIVICA is more than just an app — it’s a community-powered learning ecosystem. <br></br>  <br></br>
                Our mission is to: <br></br>

Deliver non-academic education focused on life skills, awareness, and confidence

Support volunteer educators and NGOs who want to create change at the grassroots level. <br></br> <br></br>

Make learning accessible even in low-resource settings, using simple tech and real-world examples. <br></br> <br></br>

Foster community-driven learning where children learn through discussion, storytelling, group activities, and local mentorship
              </p>
            </div>
          </div>
        </div>
      </section>

      <StatsComponenet />
      <section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white">
        {/* <LearningGrid /> */}
        <ContactFormSection />
      </section>

      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>
      <Footer />
    </div>
  )
}

export default About
