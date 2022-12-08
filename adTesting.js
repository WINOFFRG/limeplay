import { VASTClient, VASTTracker } from "@dailymotion/vast-client";

const vastClient = new VASTClient();

(async () => {
  const vastResponse = await vastClient.get(
    "https://bunnykode.blob.core.windows.net/public/samples/hotstarAdExample.xml"
  );
  //   console.log(vastResponse);

  const vastTracker = new VASTTracker(
    vastResponse,
    vastResponse.ads[0],
    vastResponse.ads[0].creatives[0]
  );

  console.log(vastTracker.trackImpression());
})();
