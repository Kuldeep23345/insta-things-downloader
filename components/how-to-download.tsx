export default function HowToDownload() {
  return (
    <>
      <div className="text-center mb-12" id="how-it-works">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">
          How to download from Instagram?
        </h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          You must follow these three easy steps to download video, reels, and
          photo from Instagram (IG, Insta). Follow the simple steps below.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {[
          {
            title: "Copy the URL",
            description:
              "Open the Instagram application or website, copy the URL of the photo, video, reels, carousel, IGTV.",
            image: "/copy.webp",
          },
          {
            title: "Paste the link",
            description:
              "Return to the FastDl website, paste the link into the input field and click the 'Download' button.",
            image: "/paste.webp",
          },
          {
            title: "Download",
            description:
              "Quickly you will get the results with several quality options. Download what fits your needs.",
            image: "/download.webp",
          },
        ].map((step, index) => (
          <div key={index} className="text-center group">
            <div className="bg-linear-to-br from-purple-500 to-orange-500 rounded-2xl mb-6 relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <h3 className="font-bold mb-2 text-lg text-blue-600">
              {step.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
