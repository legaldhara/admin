interface LoaderProp {
    tiny?: boolean;
    small?: boolean;
    medium?: boolean;
    large?: boolean;
    borderColor?: string;
}

function Loader({ tiny, small, medium, large, borderColor = 'border-light-brand-primary' }: LoaderProp) {
    
    // const { loading } = useLoader();
    
    // if (!loading) return null

    return (
        <div className="flex justify-center items-center ">
            
            <div className={`${tiny ? 'h-2.5 w-2.5 ' : " "} ${small ? 'h-5 w-5' : ""}${medium ? 'h-10 w-10' : ""}${large ? 'h-14 w-14' : ""} animate-spin rounded-full border-t-2 border-b-3  ${borderColor}`}></div>
        </div >
    )
}

export default Loader