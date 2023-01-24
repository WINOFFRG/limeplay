import { useRouter } from "next/router";

export default  function useRawPath() {

    const router = useRouter();

    const rawPath = router.asPath.split("?")[0].split("#")[0] + "/";

    return {
        rawPath,
        router
    };
}