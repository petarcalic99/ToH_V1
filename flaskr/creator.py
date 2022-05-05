from random import shuffle
from sys import implementation
import numpy as np
import matplotlib.pyplot as plt
import torch
import torchvision
import torchvision.transforms as transforms
from torchvision.transforms import ToTensor

transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,0.5,0.5), (0.5,0.5,0.5))])
batch_size = 9

trainSetMnist = torchvision.datasets.MNIST(root='./data', train=True, download=True, transform=ToTensor())
trainLoaderMnist = torch.utils.data.DataLoader(trainSetMnist, batch_size=batch_size, shuffle=True, num_workers=1)
classes = ('0','1','2','3','4','5','6','7','8','9')

dataIterM = iter(trainLoaderMnist)
imagesM, labelsM = dataIterM.next()

def imshow(img):
    img = img / 2 + 0.5  #unnormalize
    npimg = img.numpy()
    plt.imshow(np.transpose(npimg, (1,2,0)))   #doenst work otherwise
    plt.axis('off')
    plt.show()

#show image grid, at this rate it is still a np array.
ImArray = torchvision.utils.make_grid(imagesM, nrow=3, padding=0)
imshow(ImArray)


