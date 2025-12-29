import React from 'react'
import { useState } from 'react'
import { Eye, EyeClosed } from 'lucide-react'

function Login() {
  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")
  let [showPass, Setshowpass] = useState(false)
  let [eye, seteye] = useState(true)

  // this is for eye handling just a function to toggle the value of eye visibility and the show and hide pass state
  const handleeye = () => {
    if (showPass) {
      Setshowpass(false)
      seteye(true)
    }
    else {
      Setshowpass(true)
      seteye(false)
    }
  }

  const handleSubmit = () => {
    if (username == "" || password == "") {
      alert("Pashaaaa!!! , Dono field fill kariye , Gustakh!!!!!")
    }
    else if (password.length <= 8) {
      alert("Apne khufiya adad ki taadad 8 se zyada honi chahiye pasha")
    }
    else {
      alert("Ji Ji, Form is Submitted Pasha!")
    }
  }

  return (
    <div className='bg-gray-200 lg:w-screen lg:h-screen w-full h-screen flex lg:justify-center lg:items-center lg:flex lg :justify-center'>
      <div className="bg-white lg:h-100 lg:w-120 drop-shadow-xl rounded-2xl w-screen h-screen">
        <div className='lg:text-3xl lg:font-bold lg:flex lg:justify-center lg:mt-8 text-8xl font-black mt-25 mb-20 ml-15 lg:m-0 '>Login<span className='lg:opacity-0'>.</span></div>
        <form onSubmit={handleSubmit}>
          {/* both the field and label */}
          <div className="flex justify-center">
          <div className="bg-white w-220 p-10 lg:p-0 h-full border border-gray-950 rounded-2xl lg:border-0 lg:h-0 lg:w-120 lg:bg-white ">
          <div className="lg:flex lg:flex-col lg:mt-10">
            <span className='text-3xl font-light lg:ml-8 lg:font-bold font-sans lg:mb-4 lg:text-base '>Phone or Email :</span>
            <div className='lg:flex lg:justify-center'>
              <input className='bg-gray-50 mt-7 lg:mt-0 text-3xl mb-7 lg:mb-0 pl-7 w-200 h-28 lg:h-10 lg:w-100 lg:text-sm lg:rounded-sm border-[0.5px] border-gray-500 lg:pl-3 flex items-center pb-0.5 rounded-2xl'
                value={username}
                onChange={(e) => { setusername(e.target.value) }}
                type="text"
                placeholder='Enter your Phone number or Email'
              />
            </div>
          </div>
          <div className="lg:flex lg:flex-col lg:mt-5">
            <div className='text-3xl mt-12 lg:mt-0 font-light lg:ml-8 lg:font-bold font-sans lg:mb-4 lg:text-base'>Password :</div>
            <div className='lg:flex lg:justify-center'>
              <input className='bg-gray-50 mt-7 lg:mt-0 text-3xl pl-7 w-200 h-28 lg:h-10 lg:w-100 lg:text-sm lg:rounded-sm border-[0.5px] border-gray-500 lg:pl-3 flex items-center pb-0.5 rounded-2xl'
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                type={showPass ? "text" : "password"}
                placeholder='Enter your Password'
              />
              <button className='text-xs text-left ml-2 cursor-pointer'
                type='button'
                onClick={() => {

                }}
              >
                {eye ?
                  <Eye className='w-12 h-12 lg:w-5 lg:h-5 absolute top-[636px] right-[125px] lg:top-[257px] lg:right-14 text-gray-400  '
                  onClick={handleeye} /> 
                  : 
                  <EyeClosed className='w-12 h-12 lg:w-5 lg:h-5 absolute top-[636px] right-[125px] lg:top-[257px] lg:right-14 text-gray-400 '
                  onClick={handleeye}/>}
              </button>
            </div>
          </div>
          {/* submit button */}
          <div className='lg:flex lg:justify-center'>
            <input className='w-200 h-28 rounded-2xl text-4xl mt-6 lg:w-100 lg:h-12 lg:text-sm lg:rounded-lg text-gray-50 bg-gray-900 lg:mt-7 cursor-pointer hover:bg-gray-800'
              type="Submit"
              placeholder='Login'
              value='Login'
            />
          </div>
          </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login