import React, {useContext, useEffect} from 'react';
import { StateContext } from '../context/StateContext';

const StatusBanner = () => {
  const { statusProps, setStatusProps } = useContext(StateContext);

  useEffect(() => {
    if(!statusProps) return;

    setTimeout(() => {
      setStatusProps(null);
    }, 4000);
  }, [statusProps]);

  if(!statusProps) {
    return null;
  }

  return (
    <div className="absolute bottom-0 z-[500] w-full flex justify-center pb-2">
      <div className={`${statusProps?.success ? 'bg-green-800' : 'bg-red-800'} w-3/5 rounded-3xl flex flex-col justify-center items-center py-10 text-white opacity-95 ease-in duration-300`}>

        <div className='w-full flex flex-col items-center mb-8'>
          <span className='text-2xl font-semibold pb-2'>{statusProps?.success ? 'Success!' : 'Error!'}</span>
          <span className='text-lg'>{statusProps?.success ? statusProps?.message : 'Something went wrong please try again later'}</span>
        </div>

        {statusProps?.success ? (
          <div className='w-full flex flex-col items-center'>
            <span className='text-xl font-semibold pb-2'>Note:</span>
            <span className='text-lg'>It may take a few minutes for your changes to come into effect</span>
          </div>
        ): null}
        
      </div>
    </div>
  );
}

export default StatusBanner;
