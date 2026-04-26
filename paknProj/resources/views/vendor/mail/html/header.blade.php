@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="https://inkythuatso.com/uploads/thumbnails/800/2021/12/logo-dai-hoc-nha-trang-inkythuatso-1-02-14-45-38.jpg" alt="Laravel Logo" class="logo">
@else
{!! $slot !!}
@endif
</a>
</td>
</tr>
