import signupImg from "../assets/Images/signup.webp"
import Template from "../components/core/Auth/Template"

function Signup() {
  return (
    <Template
      title="Join to be educated with Civica"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to make humans human."
      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup
