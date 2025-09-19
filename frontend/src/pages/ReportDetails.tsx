import { useAuth } from "../context/AuthContext";
import ProgressCircle from "../components/ProgressCircle";
import Card from "../components/Card";
import Loader from "../components/Loader";
import ListContainer from "../components/ListContainer";
import ProfileCard from "../components/ProfileCard";
const ReportDetails = () => {
  const { reports, loadingReports, user, team } = useAuth();

  if (loadingReports) {
    return (
      <div className="flex flex-col items-center justify-center ">
        <Loader type="dots" color="#ef4444" size={100} speed={0.6} />;
        <h1 className="text-3xl text-red-500">Loading Reports...</h1>
      </div>
    );
  }
  return (
    <div className="p-2 grid md:grid-cols-[70%_30%] gap-2 bg-gray-200 ">
      <div>
        <div className="p-2">
          <div className="p-3 rounded-lg flex  bg-solid-blue w-full ">
            <div className="md:w-[40%] pl-3">
              <h1 className="mt-2 mb-2 text-xl font-bold">
                Today's Work Hours
              </h1>
              <ProgressCircle
                size="150"
                progressColor="#ceefdc"
                trackColor="white"
                holeColor="#43b684"
              />
            </div>
            <div className="flex flex-col flex-1 text-xl md:text-4xl font-medium items-center m-auto">
              <h1>Nice Work! You've reached</h1>
              <h1>your daily goal 🦋</h1>
            </div>
          </div>
        </div>
        <div className="md:hidden">
          <div className="bg-white rounded-lg  md:flex flex-col">
            {user?.role === "admin" ? (
              <div>
                <div className="p-3">
                  <h1 className="text-center text-medium text-xl">
                    Team Members
                  </h1>
                  <hr className="mt-2" />
                </div>
                <div>
                  {team.length == 0 ? (
                    <div>No team list</div>
                  ) : (
                    <div>
                      {team.map((teamMember) => (
                        <ListContainer
                          name={teamMember.name}
                          locale={teamMember.locale}
                          totalhours={teamMember.totalSeconds}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="">
                <ProfileCard
                  name={user?.name || ""}
                  locale={user?.locale || ""}
                  email={user?.email || ""}
                />
              </div>
            )}
          </div>
        </div>
        <div>
          {reports.length == 0 ? (
            <div className="flex items-center mt-4">
              <h1 className="text-2xl">No report Added yet</h1>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 p-2 gap-3">
              {reports.map((report) => {
                return (
                  <Card
                    key={report.imageUrl}
                    imageUrl={report.imageUrl}
                    id={report.id}
                    workhour={report.workhour}
                    name={report.name}
                    locale={report.locale}
                    date={report.date}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="bg-white hidden rounded-lg  md:flex flex-col">
        {user?.role === "admin" ? (
          <div>
            <div className="p-3">
              <h1 className="text-center text-medium text-xl">Team Members</h1>
              <hr className="mt-2" />
            </div>
            <div>
              {team.length == 0 ? (
                <div>No team list</div>
              ) : (
                <div>
                  {team.map((teamMember, index) => (
                    <ListContainer
                      key={index + 1}
                      name={teamMember.name}
                      locale={teamMember.locale}
                      totalhours={teamMember.totalSeconds}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="">
            <ProfileCard
              name={user?.name || ""}
              locale={user?.locale || ""}
              email={user?.email || ""}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDetails;
