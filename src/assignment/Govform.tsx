import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const prefixOptions = ["นาย", "นางสาว", "นาง"];
const ministerOptions = ["นายกรัฐมนตรี", "รองนายกรัฐมนตรี", "รัฐมนตรีว่าการ", "รัฐมนตรีช่วย", "ปลัดกระทรวง", "ไม่มีตำแหน่ง"];
const ministryOptions = ["กระทรวงมหาดไทย", "กระทรวงศึกษาธิการ", "กระทรวงสาธารณสุข", "อื่นๆ"];
const partyOptions = ["พรรคก้าวไกล", "พรรคเพื่อไทย", "ชาติไทยพัฒนา", "พรรครวมไทยสร้างชาติ", "พรรคกล้าธรรม" ,"พรรคประชาธิปัตย์" ,"พรรคประชาชาติ" ,"พรรคชาติพัฒนา" ,"อิสระ"];

const schema = z.object({
  prefix: z.string().min(1, "กรุณาเลือกคำนำหน้า"),
  firstName: z.string().min(1, "กรุณากรอกชื่อ"),
  lastName: z.string().min(1, "กรุณากรอกนามสกุล"),
  photo: z.instanceof(FileList).optional().refine((fileList) => !fileList || fileList.length === 1, "กรุณาอัปโหลดรูปถ่าย 2 นิ้ว"),
  workHistory: z.string().min(1, "กรุณากรอกประวัติการทำงาน"),
  minister: z.string().min(1, "กรุณาเลือกตำแหน่งรัฐมนตรี"),
  minister2: z.string().optional(),
  ministry: z.string().min(1, "กรุณาเลือกกระทรวง"),
  party: z.string().min(1, "กรุณาเลือกพรรค"),
});

type FormData = z.infer<typeof schema>;

interface Member extends FormData {
  id: number;
}

export default function Govform() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [members, setMembers] = useState<Member[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editPhoto, setEditPhoto] = useState<FileList | null>(null);

  const onSubmit = (data: FormData) => {
    // ถ้าไม่ได้เลือกไฟล์ใหม่ ให้ใช้ไฟล์เดิม
    let photoToSave =
      data.photo && data.photo.length === 1
        ? data.photo
        : editPhoto || new DataTransfer().files;

    if (editId !== null) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editId ? { ...data, photo: photoToSave, id: editId } : m
        )
      );
      setEditId(null);
      setEditPhoto(null);
    } else {
      setMembers((prev) => [
        ...prev,
        { ...data, photo: photoToSave, id: Date.now() },
      ]);
    }
    reset();
  };

  const handleEdit = (member: Member) => {
    setEditId(member.id);
    setEditPhoto(member.photo || null); // เก็บรูปเดิมไว้
    reset({
      prefix: member.prefix,
      firstName: member.firstName,
      lastName: member.lastName,
      photo: new DataTransfer().files, // ให้เลือกใหม่ได้
      workHistory: member.workHistory,
      minister: member.minister,
      minister2: member.minister2 || "",
      ministry: member.ministry,
      party: member.party,
    });
  };

  const handleDelete = (id: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (editId === id) {
      setEditId(null);
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center py-8 px-4">
      {/* Header with Thai Government Style */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4 shadow-xl">
          <div className="text-3xl">TH</div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">ระบบคณะรัฐมนตรี</h1>
        <p className="text-blue-200">ราชอาณาจักรไทย</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white max-w-lg w-full mx-auto p-8 rounded-2xl shadow-2xl border-2 border-blue-100 backdrop-blur-sm"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
            ทะเบียนสมาชิกผู้แทนราษฎร
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-yellow-500 mx-auto rounded-full"></div>
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">คำนำหน้า</label>
          <select {...register("prefix")} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
            <option value="">เลือกคำนำหน้า</option>
            {prefixOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.prefix?.message && <div className="text-red-500 text-sm mt-2 flex items-center"><span className="mr-1">⚠️</span>{errors.prefix.message}</div>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">ชื่อ</label>
            <input type="text" {...register("firstName")} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" placeholder="กรอกชื่อ" />
            {errors.firstName?.message && <div className="text-red-500 text-sm mt-2 flex items-center"><span className="mr-1">⚠️</span>{errors.firstName.message}</div>}
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">นามสกุล</label>
            <input type="text" {...register("lastName")} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" placeholder="กรอกนามสกุล" />
            {errors.lastName?.message && <div className="text-red-500 text-sm mt-2 flex items-center"><span className="mr-1">⚠️</span>{errors.lastName.message}</div>}
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">รูปถ่าย 2 นิ้ว</label>
          <div className="relative">
            <input type="file" accept="image/*" {...register("photo")} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
          {errors.photo?.message && <div className="text-red-500 text-sm mt-2 flex items-center"><span className="mr-1">⚠️</span>{errors.photo.message}</div>}
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">ประวัติการทำงาน</label>
          <textarea rows={4} {...register("workHistory")} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none" placeholder="กรอกประวัติการทำงาน" />
          {errors.workHistory?.message && <div className="text-red-500 text-sm mt-2 flex items-center"><span className="mr-1">⚠️</span>{errors.workHistory.message}</div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">ตำแหน่งหลัก</label>
            <select {...register("minister")} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
              <option value="">เลือกตำแหน่ง</option>
              {ministerOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errors.minister?.message && <div className="text-red-500 text-sm mt-2 flex items-center"><span className="mr-1">⚠️</span>{errors.minister.message}</div>}
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">ตำแหน่งรอง</label>
            <select {...register("minister2")} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
              <option value="">เลือกตำแหน่ง (ถ้ามี)</option>
              {ministerOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">กระทรวง</label>
            <select {...register("ministry")} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
              <option value="">เลือกกระทรวง</option>
              {ministryOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errors.ministry?.message && <div className="text-red-500 text-sm mt-2 flex items-center"><span className="mr-1">⚠️</span>{errors.ministry.message}</div>}
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">พรรคการเมือง</label>
            <select {...register("party")} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
              <option value="">เลือกพรรค</option>
              {partyOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.party?.message && <div className="text-red-500 text-sm mt-2 flex items-center"><span className="mr-1">⚠️</span>{errors.party.message}</div>}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className={`flex-1 py-3 px-6 rounded-lg font-bold text-white shadow-lg transition-all duration-200 transform hover:scale-105 ${editId !== null 
              ? "bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700" 
              : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"} 
              border border-transparent`}
          >
            {editId !== null ? "💾 บันทึกการแก้ไข" : "📋 บันทึกข้อมูล"}
          </button>
          {editId !== null && (
            <button
              type="button"
              className="flex-1 py-3 px-6 rounded-lg font-bold text-gray-700 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 shadow-lg transition-all duration-200 transform hover:scale-105 border border-gray-300"
              onClick={() => {
                setEditId(null);
                setEditPhoto(null);
                reset();
              }}
            >
              ❌ ยกเลิกการแก้ไข
            </button>
          )}
        </div>
      </form>
      
      {/* ตารางแสดงสมาชิกทั้งหมด */}
      <div className="max-w-6xl w-full mx-auto mt-12 bg-white rounded-2xl shadow-2xl border-2 border-blue-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white p-6">
          <h3 className="text-2xl font-bold text-center flex items-center justify-center">
            📊 รายชื่อสมาชิกผู้แทนราษฎร
          </h3>
          <p className="text-center text-blue-200 mt-2">ข้อมูลสมาชิกทั้งหมดในระบบ</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <tr>
                <th className="px-4 py-4 border-b-2 border-blue-200 text-blue-800 font-bold">รูปถ่าย</th>
                <th className="px-4 py-4 border-b-2 border-blue-200 text-blue-800 font-bold">คำนำหน้า</th>
                <th className="px-4 py-4 border-b-2 border-blue-200 text-blue-800 font-bold">ชื่อ-สกุล</th>
                <th className="px-4 py-4 border-b-2 border-blue-200 text-blue-800 font-bold">ตำแหน่งหลัก</th>
                <th className="px-4 py-4 border-b-2 border-blue-200 text-blue-800 font-bold">ตำแหน่งรอง</th>
                <th className="px-4 py-4 border-b-2 border-blue-200 text-blue-800 font-bold">กระทรวง</th>
                <th className="px-4 py-4 border-b-2 border-blue-200 text-blue-800 font-bold">พรรค</th>
                <th className="px-4 py-4 border-b-2 border-blue-200 text-blue-800 font-bold">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500 bg-gray-50">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-4">📋</div>
                      <p className="text-lg">ยังไม่มีข้อมูลสมาชิก</p>
                      <p className="text-sm text-gray-400">เพิ่มข้อมูลสมาชิกใหม่ได้จากฟอร์มด้านบน</p>
                    </div>
                  </td>
                </tr>
              ) : (
                members.map((m, index) => (
                  <tr key={m.id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-4 border-b border-gray-200 text-center">
                      {m.photo && m.photo.length > 0 && m.photo[0] instanceof File ? (
                        <div className="flex justify-center">
                          <img src={URL.createObjectURL(m.photo[0])} alt="รูปถ่าย" className="w-16 h-16 object-cover rounded-full border-2 border-blue-200 shadow-md" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center border-2 border-gray-300">
                          <span className="text-gray-400 text-xl">👤</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200 text-center font-medium">{m.prefix}</td>
                    <td className="px-4 py-4 border-b border-gray-200 font-semibold text-gray-800">{m.firstName} {m.lastName}</td>
                    <td className="px-4 py-4 border-b border-gray-200">
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {m.minister}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200 text-center">
                      {m.minister2 ? (
                        <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                          {m.minister2}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200">
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {m.ministry}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200">
                      <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        {m.party}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-b border-gray-200">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(m)} 
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 transform hover:scale-105"
                        >
                          ✏️ แก้ไข
                        </button>
                        <button 
                          onClick={() => handleDelete(m.id)} 
                          className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 transform hover:scale-105"
                        >
                          🗑️ ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}