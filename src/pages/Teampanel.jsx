import axios from "axios";
import api from "../lib/api";
import Webcam from "react-webcam";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "@/lib/socket";

// Components
import TeamInfo from "../components/teampanel/TeamInfo";
import TeamLogo from "../components/teampanel/TeamLogo";
import AttendanceSection from "../components/teampanel/AttendanceSection";
import ProblemStatementSection from "../components/teampanel/ProblemStatementSection";
import UpdatesSection from "../components/teampanel/UpdatesSection";
import BackButton from "../components/BackButton";


function Teampanel() {
    const { eventId } = useParams()
    const [team, setTeam] = useState(null)
    const [pass, setpass] = useState("")
    const [attd, setAttd] = useState([])
    const [open, setOpen] = useState(false)
    const [auth, setauth] = useState(false)
    const [current, setCurent] = useState({})
    const [HTML, setHtml] = useState("")
    const [currAttd, setCurrAttd] = useState()
    const [PS, setPS] = useState()
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem(`${eventId}-pass`)) {
            api.get("/participant/dashboard/" + eventId + "/" + localStorage.getItem(`${eventId}-pass`))
                .then(res => {
                    setTeam(res.data.team)
                    setAttd(res.data.attd)
                    setCurrAttd(res.data.currAttd || "")
                    setPS(res.data.PS)
                    setauth(true)
                    socket.emit("join", [eventId, res.data.team._id])
                    socket.emit("currAttd", { eventId, teamId: res.data.team._id })
                    socket.emit("getUpdate", { teamId: res.data.team._id, eventId: eventId })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [eventId])


    useEffect(() => {
        socket.on("currAttd", (id) => {
            setCurrAttd(id)
        })

        socket.on("attd", (team) => {
            setTeam(team)
        })

        socket.on("updateOn", (data) => {
            setHtml(data)
        })

        return () => {
             socket.off("currAttd");
             socket.off("attd");
             socket.off("updateOn");
        }
    }, [])

    const handlePassSubmit = () => {
        api.get("/participant/dashboard/" + eventId + "/" + pass)
            .then(res => {
                setTeam(res.data.team)
                setAttd(res.data.attd)
                setauth(true)
                localStorage.setItem(`${eventId}-pass`, pass)
                socket.emit("join", [res.data.team._id, eventId])
                socket.emit("currAttd", eventId)
            })
            .catch(err => {
                console.log(err)
                alert("Invalid Password")
            })
    }

    const handleMarkAttendance = (member, sessionId) => {
        setCurent({ ...member, role: member.role })
        setOpen(true)
    }
    const [isSubmittingPS, setIsSubmittingPS] = useState(false);

    const handleSelectPS = async (selectedPS) => {
        setIsSubmittingPS(true);
        const previousTeam = { ...team };

        // Optimistic update
        setTeam(prev => ({ ...prev, PS: selectedPS }));

        try {
            await api.post(`/participant/ps/${eventId}/${team._id}`, { PS: selectedPS });
            // Success - keep the optimistic update
        } catch (err) {
            console.error(err);
            // Revert on error
            setTeam(previousTeam);
            alert("Failed to select Problem Statement. Please try again.");
        } finally {
            setIsSubmittingPS(false);
        }
    }

    if (!auth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f4efe6] p-4 font-sans text-black pt-28">
                <div className="absolute top-6 left-6 z-20">
                    <BackButton />
                </div>
                <div className="bg-white p-8 sm:p-10 shadow-[8px_8px_0_0_#000] w-full max-w-md border-4 border-black">
                    <div className="text-center mb-8 border-b-4 border-black pb-6">
                        <div className="bg-[#7a6cf0] w-16 h-16 flex items-center justify-center mx-auto mb-4 border-4 border-black shadow-[4px_4px_0_0_#000]">
                            <span className="text-3xl text-white font-black">?</span>
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter">Team Access</h2>
                        <p className="font-serif italic mt-2 text-gray-800">Enter your event password to continue</p>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <input
                                type="password"
                                placeholder="ENTER PASSWORD"
                                className="w-full px-4 py-4 border-2 border-black focus:border-[#7a6cf0] focus:ring-0 outline-none transition-all bg-white text-black font-mono font-bold tracking-widest uppercase shadow-[4px_4px_0_0_#000] placeholder:font-serif placeholder:italic placeholder:normal-case placeholder:font-normal"
                                onChange={(e) => setpass(e.target.value)}
                                value={pass}
                            />
                        </div>
                        <button
                            onClick={handlePassSubmit}
                            className="w-full bg-black hover:bg-[#c3cfa1] hover:text-black text-white font-black uppercase tracking-widest py-4 border-2 border-black transition-all shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer"
                        >
                            Access Dashboard
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f4efe6] p-4 sm:p-6 md:p-12 pt-28 pb-24 font-sans text-black">
            <div className="absolute top-6 left-6 z-20">
                <BackButton />
            </div>

            {team && (
                <div className="max-w-7xl mx-auto">
                    {/* Top Row: Team Info & Logo */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <TeamInfo
                            team={team}
                            eventId={eventId}
                        />
                        <TeamLogo
                            team={team}
                            eventId={eventId}
                        />
                    </div>

                    {/* Middle Row: Attendance */}
                    <div className="mb-8">
                        <AttendanceSection
                            team={team}
                            attd={attd}
                            currAttd={currAttd}
                            onMarkAttendance={handleMarkAttendance}
                            eventId={eventId}
                        />
                    </div>

                    {/* Bottom Rows: Problem Statement & Updates */}
                    <div className="space-y-8">
                        <ProblemStatementSection
                            PS={PS}
                            eventId={eventId}
                            team={team}
                            onSelectPS={handleSelectPS}
                            isSubmitting={isSubmittingPS}
                        />
                        <UpdatesSection team={team} eventId={eventId} html={HTML} />
                    </div>
                </div>
            )}

            {
                open && (
                    <Model
                        mem={current}
                        setOpen={setOpen}
                        setTeam={setTeam}
                        attd={currAttd}
                        team={team}
                        event={eventId}
                    />
                )
            }
        </div >
    );
}

export default Teampanel

function Model({ mem, setOpen, setTeam, team, attd, event }) {
    const webcamRef = useRef(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [loc, setloc] = useState()

    const attdCapture = async () => {
        setIsCapturing(true);
        try {
            const imageSrc = webcamRef.current.getScreenshot();
            const formData = new FormData();
            formData.append("file", imageSrc);
            formData.append("upload_preset", "qbvu3y5j");

            const res = await axios.post(`https://api.cloudinary.com/v1_1/dfseckyjx/image/upload`, formData);
            const updatedattd = { ...mem.attd }
            let locInfo = {};
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                const { latitude, longitude } = position.coords;
                const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                console.log(geoRes.data);
                locInfo = { longitude, latitude, name: geoRes.data.display_name };
            } catch (err) {
                console.error("Location error: ", err);
            }
            updatedattd[attd] = { img: res.data.url, status: "Present", loc: locInfo }
            const participant = { ...mem, attd: updatedattd }
            if (mem.role == "lead") {
                socket.emit("markAttd", { teamId: team._id, team: { ...team, lead: { ...participant } } })
            }
            else {
                const participants = team.members.map((p) => p.name == mem.name ? participant : p)
                socket.emit("markAttd", { teamId: team._id, team: { ...team, members: participants } })
            }
            let data = await api.post(`/participant/attd/${event}/${localStorage.getItem(`${event}-pass`)}`, { participant, role: mem.role });
            data = data.data.team

            setTeam(data)
            setOpen(false);
        } catch (error) {
            console.error("Error capturing/uploading image:", error);
        } finally {
            setIsCapturing(false);
        }
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#f4efe6]/90 backdrop-blur-sm z-50 p-4 font-sans text-black">
            <div className="bg-white p-8 border-4 border-black shadow-[12px_12px_0_0_#000] w-full max-w-md text-center">
                <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
                    <h1 className="text-2xl font-black uppercase tracking-tighter">Mark Attendance</h1>
                    <button
                        onClick={() => setOpen(false)}
                        className="text-black font-black text-2xl hover:text-red-500 transition-colors cursor-pointer"
                        disabled={isCapturing}
                    >
                        X
                    </button>
                </div>

                <p className="font-serif italic mb-6 text-gray-800">Capture photo for <span className="not-italic font-black text-black">{mem.name}</span></p>

                <div className="relative border-4 border-black bg-black aspect-video mb-8 shadow-[4px_4px_0_0_#000]">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={attdCapture}
                        disabled={isCapturing}
                        className="w-full px-6 py-4 bg-[#7a6cf0] hover:bg-black text-white border-4 border-black font-black uppercase tracking-widest transition-all shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isCapturing ? "Processing..." : "Capture & Upload"}
                    </button>
                </div>
            </div>
        </div>
    );
}
