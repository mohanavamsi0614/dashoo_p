import axios from "axios";
import api from "../lib/api";
import Webcam from "react-webcam";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { Shield, LogIn, Loader2, X, Camera } from "lucide-react";
import socket from "@/lib/socket";

// Components
import TeamInfo from "../components/teampanel/TeamInfo";
import TeamLogo from "../components/teampanel/TeamLogo";
import AttendanceSection from "../components/teampanel/AttendanceSection";
import ProblemStatementSection from "../components/teampanel/ProblemStatementSection";
import UpdatesSection from "../components/teampanel/UpdatesSection";


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

    // Customization State
    const [customization, setCustomization] = useState({
        header: { backgroundColor: '#000000', color: '#ffffff', font: 'inherit' },
        attendance: { backgroundColor: '#000000', color: '#ffffff', font: 'inherit' },
        problem: { backgroundColor: '#000000', color: '#ffffff', font: 'inherit' },
        updates: { backgroundColor: '#000000', color: '#ffffff', font: 'inherit' }
    });

    useEffect(() => {
        if (localStorage.getItem(`${eventId}-pass`)) {
            api.get("/participant/dashboard/" + eventId + "/" + localStorage.getItem(`${eventId}-pass`))
                .then(res => {
                    setTeam(res.data.team)
                    setAttd(res.data.attd)
                    setCurrAttd(res.data.currAttd || "")
                    setauth(true)
                    socket.emit("join", [res.data.team._id, eventId])
                    socket.emit("currAttd", { eventId, teamId: res.data.team._id })
                    socket.emit("getUpdate", { teamId: res.data.team._id, eventId: eventId })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [])


    socket.on("currAttd", (id) => {
        setCurrAttd(id)
    })

    socket.on("attd", (team) => {
        setTeam(team)
    })

    socket.on("updateOn", (data) => {
        setHtml(data)
    })


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
            })
    }

    const handleMarkAttendance = (member, sessionId) => {
        setCurent({ ...member, role: member.role })
        setOpen(true)
    }


    if (!auth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
                <div className="bg-black p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-800">
                    <div className="text-center mb-8">
                        <div className="bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-900/50">
                            <Shield className="w-8 h-8 text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Team Access</h2>
                        <p className="text-gray-400 mt-2">Enter your event password to continue</p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <input
                                type="password"
                                placeholder="Enter Password"
                                className="w-full px-4 py-3 rounded-xl border border-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-900/50 outline-none transition-all bg-gray-900 text-white placeholder-gray-600"
                                onChange={(e) => setpass(e.target.value)}
                                value={pass}
                            />
                        </div>
                        <button
                            onClick={handlePassSubmit}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 cursor-pointer"
                        >
                            <LogIn className="w-5 h-5" />
                            Access Dashboard
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!team) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-gray-400 font-medium">Loading team data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black p-6 md:p-12 pb-24">
            <div className="max-w-7xl mx-auto">
                {/* Top Row: Team Info & Logo */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <TeamInfo
                        team={team}
                        styles={customization.header}
                    />
                    <TeamLogo
                        team={team}
                        eventId={eventId}
                        styles={customization.header}
                    />
                </div>

                {/* Middle Row: Attendance */}
                <div className="mb-8">
                    <AttendanceSection
                        team={team}
                        attd={attd}
                        currAttd={currAttd}
                        onMarkAttendance={handleMarkAttendance}
                        styles={customization.attendance}
                    />
                </div>

                {/* Bottom Rows: Problem Statement & Updates */}
                <div className="space-y-8">
                    <ProblemStatementSection styles={customization.problem} />
                    <UpdatesSection styles={customization.updates} team={team} event={eventId} html={HTML} />
                </div>
            </div>



            {
                open && (
                    <Model
                        mem={current}
                        setOpen={setOpen}
                        setTeam={setTeam}
                        attd={currAttd}
                        team={team._id}
                        event={eventId}
                    />
                )
            }
        </div >
    );
}

export default Teampanel


function Model({ mem, setOpen, setTeam, attd, event }) {
    const webcamRef = useRef(null);
    console.log(mem)

    const attdCapture = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        const formData = new FormData();
        formData.append("file", imageSrc);
        formData.append("upload_preset", "qbvu3y5j");

        const res = await axios.post(`https://api.cloudinary.com/v1_1/dfseckyjx/image/upload`, formData);
        const updatedattd = { ...mem.attd }
        updatedattd[attd] = { img: res.data.url, status: "" }
        const participant = { ...mem, attd: updatedattd }
        let data = await api.post(`/participant/attd/${event}/${localStorage.getItem(`${event}-pass`)}`, { participant, role: mem.role });
        data = data.data.team
        console.log(data)
        setTeam(data)
        setOpen(false);
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-4">
            <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-md text-center border border-gray-800 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold text-white">Mark Attendance</h1>
                    <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-200 cursor-pointer">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <p className="text-gray-400 mb-4">Capture photo for <span className="font-semibold text-white">{mem.name}</span></p>

                <div className="relative rounded-xl overflow-hidden bg-black aspect-video mb-6 shadow-inner border border-gray-800">
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
                        className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl text-white font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Camera className="w-5 h-5" />
                        Capture & Upload
                    </button>
                </div>
            </div>
        </div>
    );
}