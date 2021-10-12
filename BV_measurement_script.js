importPackage(Packages.ij);
importPackage(Packages.sc.fiji.analyzeSkeleton);
importClass(Packages.java.io.File)
importClass(Packages.ij.measure.ResultsTable);


var rt = new ResultsTable();

extension = ".tif";
   dir = IJ.getDir("Choose Source Directory ");
   if (dir==null) IJ.exit();
   f = new File(dir);
   list = f.list();
   for (i=0; i<list.length; i++) { //start of for loop
   	 IJ.showProgress(i);
      if (!list[i].endsWith(extension))
         continue;
      path = dir+list[i];
      imp = IJ.openImage(path);



// create string for image title
var str = imp.getTitle();
var title = str.replace(".tif", "");

// modify image and Skeletonize
IJ.run(imp, "8-bit", "");
IJ.setRawThreshold(imp, 50, 255, null);
Prefs.blackBackground = false;
IJ.run(imp, "Convert to Mask", "");
IJ.run(imp, "Skeletonize (2D/3D)", "");

 
// Initialize AnalyzeSkeleton_
var skel = new AnalyzeSkeleton_();

skel.setup("", imp);
 
// Perform analysis in silent mode
// (work on a copy of the ImagePlus if you don't want it displayed)
// run(int pruneIndex, boolean pruneEnds, boolean shortPath, ImagePlus origIP, boolean silent, boolean verbose)
var skelResult = skel.run(AnalyzeSkeleton_.NONE, false, false, null, true, false);
 
// Read the results
var branchLengths = skelResult.getAverageBranchLength();
var branchNumbers = skelResult.getBranches();
var totalLength = 0;
for (var j = 0; j < branchNumbers.length; j++) { // loop to get all branches 
    totalLength += branchNumbers[j] * branchLengths[j];
} // end of branches loop

var string_title = String(title);

     rt.addRow(); // rt.incrementCounter() in 1.53c or earlier versions
     rt.addValue("image", string_title);
     rt.addValue("total_length", totalLength);
 IJ.showProgress(i);
} // end of loop 

rt.show("Results_Table");
IJ.saveAs("Results", dir);
