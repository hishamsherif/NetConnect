import { Button } from "@/components/ui/button";

export default function ButtonTest() {
  return (
    <div className="fixed top-4 right-4 z-50 bg-white border-2 border-red-500 p-4 rounded-lg shadow-lg">
      <h3 className="text-red-600 font-bold mb-2">Button Test Component</h3>
      
      {/* Basic HTML button test */}
      <button 
        onClick={(e) => {
          console.log("🔴 HTML BUTTON CLICKED");
          console.log("Event:", e);
          alert("HTML button works!");
        }}
        className="block mb-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        HTML Button
      </button>
      
      {/* React Button component test */}
      <Button
        onClick={(e) => {
          console.log("🔴 REACT BUTTON CLICKED");
          console.log("Event:", e);
          alert("React Button works!");
        }}
        className="mb-2"
      >
        React Button
      </Button>
      
      {/* Div with click handler test */}
      <div
        onClick={(e) => {
          console.log("🔴 DIV CLICKED");
          console.log("Event:", e);
          alert("Div click works!");
        }}
        className="cursor-pointer bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Clickable Div
      </div>
      
      <script dangerouslySetInnerHTML={{
        __html: `
          console.log("🔴 DEBUG: JavaScript is running");
          console.log("🔴 DEBUG: DOM loaded:", document.readyState);
          console.log("🔴 DEBUG: React loaded:", typeof React !== 'undefined');
        `
      }} />
    </div>
  );
}