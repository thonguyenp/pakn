<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\PhanAnh;
use Illuminate\Http\Request;

class PhanAnhController extends Controller
{
    //
        // Lấy danh sách phản ánh
    public function index()
    {
        $data = PhanAnh::orderByDesc('IdPhanAnh')->paginate(2);

        return response()->json($data);

    }

    // Lấy chi tiết 1 phản ánh
    public function show($id)
    {
        $phanAnh = PhanAnh::find($id);

        if(!$phanAnh){
            return response()->json([
                'message' => 'Không tìm thấy phản ánh'
            ],404);
        }

        return response()->json($phanAnh);
    }
    // Cập nhật phản ánh
    public function update(Request $request, $id)
    {
        $phanAnh = PhanAnh::find($id);

        if(!$phanAnh){
            return response()->json([
                'message'=>'Không tìm thấy phản ánh'
            ],404);
        }

        $phanAnh->update($request->all());

        return response()->json([
            'message'=>'Cập nhật thành công',
            'data'=>$phanAnh
        ]);
    }

    // Xóa phản ánh
    public function destroy($id)
    {
        $phanAnh = PhanAnh::find($id);

        if(!$phanAnh){
            return response()->json([
                'message'=>'Không tìm thấy phản ánh'
            ],404);
        }

        $phanAnh->delete();

        return response()->json([
            'message'=>'Xóa thành công'
        ]);
    }

}
