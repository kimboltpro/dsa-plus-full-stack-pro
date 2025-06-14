
export const Stats = () => {
  const stats = [
    { label: "Active Learners", value: "10,000+", color: "text-blue-600" },
    { label: "Problems Solved", value: "50,000+", color: "text-green-600" },
    { label: "Success Rate", value: "95%", color: "text-purple-600" },
    { label: "Interview Offers", value: "1,200+", color: "text-orange-600" }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Thousands of Developers
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join the community of successful developers who mastered DSA with our platform
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-blue-100 text-lg">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
