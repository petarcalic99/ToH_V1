from random import shuffle
from sys import implementation
import numpy as np
import matplotlib.pyplot as plt
import torch
import torchvision
import torchvision.transforms as transforms
import cv2
from torchvision.transforms import ToTensor


transform = transforms.Compose([transforms.ToTensor(), torchvision.transforms.Normalize(
                                 (0.1307,), (0.3081,))]) #if used makes resizing afekt more
batch_size = 25
                #82 % to have at least 1 occurence of the numbre X for the batch
                # 4x4 and 1 good answer (Binomial Law). A Random response has
                # 6% chance to guess correctly.
                # 92% to have at least 1 occurence for the batch 5x5 and only 1 good answer.
                # A random guess has 4% chance to guess correctly
trainSetMnist = torchvision.datasets.MNIST(root='./data', train=True, download=True, transform=ToTensor())
trainLoaderMnist = torch.utils.data.DataLoader(trainSetMnist, batch_size=batch_size, shuffle=True, num_workers=1)
classes = ('0','1','2','3','4','5','6','7','8','9')

dataIterM = iter(trainLoaderMnist)
imagesM, labelsM = dataIterM.next()

def resizeIm(src, scale_percent):
    #percent by which the image is resized: scale_percent
    #calculate the 50 percent of original dimensions
    width = int(src.shape[1] * scale_percent / 100)
    height = int(src.shape[0] * scale_percent / 100)
    dsize = (width, height)

    # resize image
    output = cv2.resize(src, dsize)
    return output

#For testing purposes shows the image
def imshow(img):
    img = img / 2 + 0.5  #unnormalize
    npimg = img.numpy() #tensor to np
    plt.imshow(np.transpose(npimg, (1,2,0)))   #doenst work otherwise
    plt.axis('off')
    plt.show()

#return image grid, np array to list conversion also.
def retImGrid():
    imagesM, labelsM = dataIterM.next()
    img = torchvision.utils.make_grid(imagesM, nrow=5, padding=0)
    #img = img / 2 + 0.5
    npimg = img.numpy()                   #TURNS IT INTO RGB PIXELS!!!!!!!!!!
    npImgTr = np.transpose(npimg, (1,2,0))
    npImgTrResized = resizeIm(npImgTr, 300)      #resizidng
    imgGrid = npImgTrResized.tolist() 
    return imgGrid



#Test    
"""
listImg = retImGrid()
plt.imshow(listImg)
plt.axis('off')
plt.show()
"""
