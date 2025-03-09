interface MoodRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mood: string, note: string) => void;
}

export default function MoodRecordModal({ isOpen, onClose, onSubmit }: MoodRecordModalProps) {
  if (!isOpen) return null;

  const moodTypes = [
    { name: '精彩！', emoji: '😊', color: 'bg-red-100', textColor: 'text-red-800' },
    { name: '感觉棒极了~', emoji: '☺️', color: 'bg-orange-100', textColor: 'text-orange-800' },
    { name: '我还好。', emoji: '😐', color: 'bg-yellow-100', textColor: 'text-yellow-800' },
    { name: '有点郁郁...', emoji: '😔', color: 'bg-green-100', textColor: 'text-green-800' },
    { name: '痛苦 TT', emoji: '😢', color: 'bg-blue-100', textColor: 'text-blue-800' }
  ];

  const handleSubmit = (mood: string, note: string) => {
    onSubmit(mood, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">记录今天的心情</h2>
        
        {/* 心情选择 */}
        <div className="space-y-4 mb-6">
          {moodTypes.map((mood, index) => (
            <button
              key={index}
              onClick={() => handleSubmit(mood.name, '')}
              className={`w-full p-4 rounded-lg flex items-center ${mood.color} ${mood.textColor} hover:opacity-90 transition-opacity`}
            >
              <span className="text-2xl mr-3">{mood.emoji}</span>
              <span className="font-medium">{mood.name}</span>
            </button>
          ))}
        </div>

        {/* 关闭按钮 */}
        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
} 