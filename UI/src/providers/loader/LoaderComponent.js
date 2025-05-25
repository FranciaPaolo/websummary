import { useAuth } from "../auth/AuthProvider";
import './loaderComponent.css';

/**
 * This is the UI of the loading indicator.
 * To use it: 
 * 1) import the useAuth 
 * const auth = useAuth(); 
 * 2) start the loadin with: auth.setLoaderOn(); 
 * 3) do your heavy task...
 * 4) stop the loader with: auth.setLoaderOff();
 * @returns 
 */
const Loader = () => {
    const auth = useAuth();

    return (
        <>
            {auth.isLoading ? (
                <div className="h-100 w-100 position-absolute top-0 left-0 bg-black/20 z-[99999]">
                    <div className="position-absolute w-100 text-center d-flex justify-content-center loaderContainer">
                        <div className="loader">
                            <div className="loaderBar"></div>
                        </div>
                        {/* <div class="spinner-border" role="status">
                            <span class="sr-only"></span>
                        </div> */}
                        {/* <span className="text text-white">{auth.loaderText}</span> */}
                    </div>
                </div>
            ) : null}
        </>
    )
};

export default Loader;