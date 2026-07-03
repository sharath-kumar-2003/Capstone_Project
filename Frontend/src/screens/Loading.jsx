import { Spinner } from '../components'

function Loading() {
    return (
        <div className='w-full h-dvh flex justify-center items-center bg-[#0A0A0A] text-white animate-fadeIn'>
            <div className="flex flex-col items-center gap-3">
                <Spinner scale={150} />
                <p className="text-xs text-[#8A8A8A] font-medium tracking-widest uppercase mt-2">Loading</p>
            </div>
        </div>
    )
}

export default Loading