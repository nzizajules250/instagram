import { Card, CardContent } from '@/components/ui/card'
import { Info } from 'lucide-react'

export function DemoInfo() {
  return (
    <Card className="w-full bg-blue-50 border-blue-200 mt-4">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <h4 className="font-semibold text-blue-900 mb-2">Demo Instagram Clone</h4>
            <p className="text-blue-800 mb-2">
              Try the demo with these credentials:
            </p>
            <div className="bg-white rounded p-3 border border-blue-200">
              <p className="font-mono text-sm">
                <strong>Username:</strong> demo_user<br />
                <strong>Password:</strong> password
              </p>
            </div>
            <p className="text-blue-700 text-xs mt-2">
              This is a fully functional Instagram clone with real-time messaging,
              post creation, and all social features!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
